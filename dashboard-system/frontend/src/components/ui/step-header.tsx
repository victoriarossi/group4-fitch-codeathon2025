interface StepHeaderProps {
  stepNumber: number;
  title: string;
  description: string;
}

export function StepHeader({ stepNumber, title, description }: StepHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-4 mb-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#3F4D64]/10 border border-[#3F4D64]/20">
          <span className="text-[#3F4D64]">{stepNumber}</span>
        </div>
        <h2 className="text-[#1A1A1A] text-2xl">{title}</h2>
      </div>
      <p className="text-[#8B8F94] ml-14">{description}</p>
    </div>
  );
}
