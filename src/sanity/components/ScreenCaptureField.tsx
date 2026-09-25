import { Button, Card, Text } from "@sanity/ui";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { captureVideoFrame, frameFileName } from "@/lib/capture-frame";
import {
  isScreenCaptureSupported,
  isUsableCrop,
  normalizeCropRect,
  startScreenCapture,
  stopScreenCapture,
  type CropRect,
} from "@/lib/screen-capture";

interface ScreenCaptureFieldProps {
  busy: boolean;
  label: string;
  onBusy: (busy: boolean) => void;
  onStatus: (status: string | null) => void;
  upload: (file: File, working: string) => Promise<boolean>;
}

/* Support cannot change during a session, so there is nothing to subscribe to. */
function subscribeNever(): () => void {
  return () => {};
}

type Stage = "idle" | "live" | "cropping";

export function ScreenCaptureField({
  busy,
  label,
  onBusy,
  onStatus,
  upload,
}: ScreenCaptureFieldProps) {
  const liveRef = useRef<HTMLVideoElement>(null);
  const stillRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  /* Reads navigator, which is absent while rendering on the server, so the
     server snapshot is false and the client's is the real answer. That keeps
     the two renders consistent without setting state from an effect. */
  const supported = useSyncExternalStore(
    subscribeNever,
    isScreenCaptureSupported,
    () => false,
  );
  const [stage, setStage] = useState<Stage>("idle");
  const [stillUrl, setStillUrl] = useState<string | null>(null);
  const [crop, setCrop] = useState<CropRect | null>(null);
  const dragStart = useRef<{ x: number; y: number } | null>(null);

  const stop = useCallback((): void => {
    stopScreenCapture(streamRef.current);
    streamRef.current = null;
  }, []);

  /* The browser keeps showing "sharing your screen" until every track is
     stopped, so this must run however the field goes away. */
  useEffect(() => stop, [stop]);

  async function begin(): Promise<void> {
    onStatus(null);
    try {
      const stream = await startScreenCapture();
      streamRef.current = stream;
      setStage("live");

      /* The element only exists once the live stage has rendered. */
      requestAnimationFrame(() => {
        const video = liveRef.current;
        if (!video) {
          return;
        }
        video.srcObject = stream;
        void video.play().catch(() => undefined);
      });

      /* Picking "Stop sharing" in the browser's own bar ends the track. */
      stream.getVideoTracks()[0]?.addEventListener("ended", () => {
        stop();
        setStage((current) => (current === "live" ? "idle" : current));
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      /* Dismissing the picker rejects; that is a choice, not a failure. */
      const cancelled =
        error instanceof Error &&
        (error.name === "NotAllowedError" || error.name === "AbortError");
      onStatus(cancelled ? null : `Couldn't start the capture: ${message}`);
      setStage("idle");
    }
  }

  function freezeFrame(): void {
    const live = liveRef.current;
    if (!live || !live.videoWidth) {
      onStatus("The shared screen has not produced a frame yet.");
      return;
    }

    /* Hold the element that carries the pixels, then stop sharing: the capture
       is already in memory, so the browser's sharing banner can go away while
       the crop is chosen. */
    stillRef.current = live;
    const canvas = document.createElement("canvas");
    canvas.width = live.videoWidth;
    canvas.height = live.videoHeight;
    canvas.getContext("2d")?.drawImage(live, 0, 0);
    setStillUrl(canvas.toDataURL("image/jpeg", 0.92));
    setCrop(null);
    setStage("cropping");
  }

  function pointerFraction(event: React.PointerEvent): {
    x: number;
    y: number;
  } {
    const bounds = boxRef.current?.getBoundingClientRect();
    if (!bounds || !bounds.width || !bounds.height) {
      return { x: 0, y: 0 };
    }
    return {
      x: (event.clientX - bounds.left) / bounds.width,
      y: (event.clientY - bounds.top) / bounds.height,
    };
  }

  async function applySelection(): Promise<void> {
    const still = stillRef.current;
    if (!still) {
      return;
    }
    onBusy(true);
    try {
      const file = await captureVideoFrame({
        video: still,
        fileName: frameFileName(`${label}-screen`, 0),
        crop,
      });
      await upload(file, "Uploading the captured frame…");
      stop();
      setStage("idle");
      setStillUrl(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      console.error(`Failed to use the capture: ${message}`);
      onStatus(message);
    } finally {
      onBusy(false);
    }
  }

  /* Checked after mounting rather than during render: the check reads
     navigator, which does not exist while rendering on the server, and
     returning different markup on each side is a hydration mismatch. */
  if (!supported) {
    return null;
  }

  return (
    <div style={{ display: "grid", gap: 8 }}>
      {stage === "idle" ? (
        <>
          <Button
            disabled={busy}
            mode="ghost"
            onClick={() => void begin()}
            text="Capture from the screen"
            tone="primary"
          />
          <Text muted size={0}>
            Open the video in another tab, then pick that tab when the browser
            asks. Nothing is sent anywhere until you choose a frame.
          </Text>
        </>
      ) : null}

      {stage === "live" ? (
        <>
          <video
            autoPlay
            muted
            playsInline
            ref={liveRef}
            style={{
              background: "#000",
              borderRadius: 4,
              display: "block",
              maxHeight: 280,
              width: "100%",
            }}
          />
          <Button
            mode="ghost"
            onClick={freezeFrame}
            text="Freeze this frame"
            tone="primary"
          />
          <Button
            mode="bleed"
            onClick={() => {
              stop();
              setStage("idle");
            }}
            text="Cancel"
          />
        </>
      ) : null}

      {stage === "cropping" && stillUrl ? (
        <>
          <Text muted size={0}>
            Drag across the video to crop it out of the screenshot, or use the
            whole frame as it is.
          </Text>
          <div
            onPointerDown={(event) => {
              event.currentTarget.setPointerCapture(event.pointerId);
              dragStart.current = pointerFraction(event);
              setCrop(null);
            }}
            onPointerMove={(event) => {
              const start = dragStart.current;
              if (!start) {
                return;
              }
              const now = pointerFraction(event);
              setCrop(normalizeCropRect(start.x, start.y, now.x, now.y));
            }}
            onPointerUp={() => {
              dragStart.current = null;
            }}
            ref={boxRef}
            style={{
              borderRadius: 4,
              cursor: "crosshair",
              display: "block",
              overflow: "hidden",
              position: "relative",
              touchAction: "none",
            }}
          >
            <img
              alt="Captured screen"
              draggable={false}
              src={stillUrl}
              style={{ display: "block", width: "100%" }}
            />
            {isUsableCrop(crop) ? (
              <div
                style={{
                  border: "2px solid #4a9eff",
                  boxShadow: "0 0 0 9999px rgba(0,0,0,0.45)",
                  height: `${crop.height * 100}%`,
                  left: `${crop.x * 100}%`,
                  pointerEvents: "none",
                  position: "absolute",
                  top: `${crop.y * 100}%`,
                  width: `${crop.width * 100}%`,
                }}
              />
            ) : null}
          </div>
          <Button
            disabled={busy}
            mode="ghost"
            onClick={() => void applySelection()}
            text={
              isUsableCrop(crop) ? "Use the selection" : "Use the whole frame"
            }
            tone="primary"
          />
          <Button
            disabled={busy}
            mode="bleed"
            onClick={() => setStage("live")}
            text="Back to the live view"
          />
        </>
      ) : null}

      {stage !== "idle" ? (
        <Card padding={2} radius={2} tone="caution">
          <Text size={0}>
            Your browser is sharing a screen; it stops when you pick a frame or
            cancel.
          </Text>
        </Card>
      ) : null}
    </div>
  );
}
