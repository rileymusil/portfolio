import {
  buildStructuredData,
  serializeStructuredData,
} from "@/lib/structured-data";

export function StructuredData() {
  return (
    <script
      type="application/ld+json"
      /* The payload is built from our own constants and escaped in
         serializeStructuredData, so there is no untrusted input here. */
      dangerouslySetInnerHTML={{
        __html: serializeStructuredData(buildStructuredData()),
      }}
    />
  );
}
