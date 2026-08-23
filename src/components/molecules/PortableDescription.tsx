import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";

interface LinkAnnotation {
  href?: string;
  openInNewTab?: boolean;
}

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc pl-5">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal pl-5">{children}</ol>,
  },
  marks: {
    /* The Studio's link annotation carries its own openInNewTab flag. Anything
       opened in a new tab gets rel="noopener" so the linked page can't reach
       back through window.opener. */
    link: ({ value, children }) => {
      const { href, openInNewTab } = (value ?? {}) as LinkAnnotation;
      if (!href) {
        return <>{children}</>;
      }
      return (
        <a
          href={href}
          {...(openInNewTab === false
            ? {}
            : { target: "_blank", rel: "noopener noreferrer" })}
        >
          {children}
        </a>
      );
    },
  },
};

interface PortableDescriptionProps {
  value: PortableTextBlock[];
  className?: string;
}

export function PortableDescription({
  value,
  className,
}: PortableDescriptionProps) {
  if (!value.length) {
    return null;
  }

  return (
    <div className={className}>
      <PortableText value={value} components={components} />
    </div>
  );
}
