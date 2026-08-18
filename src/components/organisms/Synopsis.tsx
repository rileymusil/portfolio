import { BookNowButton } from "@/components/atoms/BookNowButton";

export function Synopsis() {
  return (
    <section className="bg-muted px-[6%] py-16 text-center md:px-[10%]">
      <p className="mx-auto max-w-[800px] font-sans text-[1.2rem] font-normal text-[#555]">
        I am a creative professional and a graduate of{" "}
        <strong className="font-semibold">Lone Star College Kingwood</strong> with an
        Associate’s in Visual Communication and Film and Video. I specialize in event
        coverage, and commercial production, blending technical precision with creative
        storytelling.
      </p>
      <p className="mx-auto mt-4 max-w-[800px] font-sans text-[1.2rem] font-normal text-[#555]">
        I also offer photography services for all types of events and celebrations,
        as well as personal portrait sessions on location.
      </p>
      <div className="mt-8">
        <BookNowButton />
      </div>
    </section>
  );
}
