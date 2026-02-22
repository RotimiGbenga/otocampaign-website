import { ReactNode } from "react";

type FormSectionProps = {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function FormSection({
  title,
  description,
  children,
  footer,
}: FormSectionProps) {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
          <h2 className="section-title mb-2">{title}</h2>
          <p className="text-gray-600 mb-8">{description}</p>
          {children}
        </div>
        {footer && <div className="mt-12">{footer}</div>}
      </div>
    </section>
  );
}
