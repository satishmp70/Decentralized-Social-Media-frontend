import Link from "next/link";

export default function Home() {
  return (
    <section className="text-center py-10">
      <h2 className="text-3xl font-bold mb-4">Welcome to the dApp Frontend</h2>
      <p className="mb-6 text-gray-500 dark:text-gray-300">
        Hello decentralized world! Web3 is the future.
      </p>
      <Link
        href="/feed"
        className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        View Posts
      </Link>
    </section>
  );
}

