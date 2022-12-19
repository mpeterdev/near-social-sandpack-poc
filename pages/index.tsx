import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center h-full p-5">
      <Link href="widget/michaelpeter.near/Demo">
        <span className="text-lg text-teal-400 underline">
          /widget/michaelpeter.near/Demo
        </span>
      </Link>
      <Link href="editor">
        <span className="text-lg text-teal-400 underline">/editor</span>
      </Link>
    </div>
  );
}
