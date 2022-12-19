export default function Demo() {
  return (
    <div className="flex flex-col p-10 gap-4">
      <ProfileHeader />
      <Applications />
      <People />
      <LinkOuts />
      <div className="flex flex-row justify-between">
        <FollowActivity />
        <PokeActivity />
      </div>
    </div>
  );
}

function ProfileHeader() {
  return (
    <div className="flex flex-col">
      <p className="text-4xl">Welcome to Near Social!</p>
      <div className="flex flexRow gap-2 items-center py-3">
        <DummyImage dimension={16} />
        <div className="flex flex-col justify-center gap-1">
          <div className="flex flex-row gap-1">
            <p className="font-bold">Michael Peter</p>
            <p className="font-light">@michaelpeter.near</p>
          </div>
          <div className="flex flex-row gap-1">
            {['#developer', '#engineer', '#typescript'].map((t) => (
              <div className="rounded border p-1" key={t}>
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SearchAndResults({ title }: { title: string }) {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-2xl">{title}</h2>
      <input
        className="h-8 p-1 rounded border"
        placeholder={`Search ${title}`}
      />
      <div className="flex flex-row gap-1">
        {Array.from(Array(20).keys()).map((a) => (
          <DummyImage key={a} dimension={12} />
        ))}
      </div>
    </div>
  );
}

function Applications() {
  return <SearchAndResults title="Applications" />;
}

function People() {
  return <SearchAndResults title="People" />;
}

function DummyImage({ dimension }: { dimension: number }) {
  return (
    <div className={`rounded bg-sky-600 w-${dimension} h-${dimension}`}></div>
  );
}

function LinkOuts() {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-2xl">Get Involved</h2>
      <div className="flex flex-row gap-2">
        <button className="border rounded p-2 text-cyan-50 hover:bg-neutral-800">
          What&apos;s Near Social?
        </button>
        <button className="border rounded p-2 text-cyan-50 hover:bg-neutral-800">
          Documentation
        </button>
      </div>
    </div>
  );
}

function FollowActivity() {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-2xl">Follow Activity</h2>
      {Array.from(Array(20).keys()).map((a) => (
        <FollowItem key={a} />
      ))}
    </div>
  );
}

function FollowItem() {
  return (
    <div className="flex flex-row gap-1 items-center">
      <DummyImage dimension={10} />
      <p>A Near Enthusiast</p>
      <p className="text-slate-400">followed</p>
      <DummyImage dimension={10} />
      <p>Web3 Newcomer</p>
      <p className="text-slate-400">1 hour ago</p>
    </div>
  );
}

function PokeActivity() {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-2xl">Poke Activity</h2>
      {Array.from(Array(20).keys()).map((a) => (
        <PokeItem key={a} />
      ))}
    </div>
  );
}

function PokeItem() {
  return (
    <div className="flex flex-row gap-2 items-center">
      <DummyImage dimension={10} />
      <p className="text-2xl">👈</p>
      <DummyImage dimension={10} />
      <p className="text-slate-400">2 hours ago</p>
    </div>
  );
}
