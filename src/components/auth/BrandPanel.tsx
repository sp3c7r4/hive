import Image from "next/image";

export default function BrandPanel() {
  return (
    <div className="relative hidden md:flex flex-col justify-between h-full text-white overflow-hidden">
      {/* Background image */}
      <Image
        src="/images/young-smiling-kids.jpg"
        alt="Young students smiling and learning together"
        fill
        className="object-cover object-center"
        priority
        sizes="50vw"
      />

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-neutral-950/60 bg-gradient-to-t from-neutral-950/80 via-neutral-950/40 to-neutral-950/50" />

      {/* Logo pinned top-left */}
      <div className="relative z-10 p-8 lg:p-10">
        {/*<div className="flex items-center gap-2.5">
            <Image src="/logo.svg" alt="Hive" width={30} height={32} className="" />
        </div>*/}
      </div>

      {/* Motivational copy centered */}
      <div className="relative z-10 p-8 lg:p-10 flex flex-col gap-3 max-w-md">
        <h2 className="text-2xl lg:text-3xl font-semibold leading-tight tracking-tight">
          Your community-driven learning marketplace.
        </h2>
        <p className="text-sm text-white/50 leading-relaxed">
          Hive is where instructors build academies, students master skills, and knowledge creates opportunity, all in one place.
        </p>
      </div>
    </div>
  );
}
