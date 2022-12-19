import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center h-full p-5 gap-12">
      <p className="text-lg">
        All widget code in this POC is fetched from SocialDB
      </p>
      <div className="flex flex-col gap-1 items-center">
        <Link href="widget/michaelpeter.near/Demo">
          <span className="text-lg text-teal-400 underline">
            /widget/michaelpeter.near/Demo
          </span>
        </Link>
        <span className="text-lg">
          Static mockup of NEAR Social Welcome widget
        </span>
      </div>
      <div className="flex flex-col gap-1 items-center">
        <Link href="editor">
          <span className="text-lg text-teal-400 underline">/editor</span>
        </Link>
        <span className="text-lg">Loads source from above demo</span>
      </div>
    </div>
  );
}
