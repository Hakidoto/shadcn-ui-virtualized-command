"use client";
import { useEffect, useState } from "react";
import { CommandDialogVirtual } from "./command-virtualized";
import { randomUserList } from "./users";

interface RandomUser {
  name: { first: string; last: string };
  login: { uuid: string };
  picture: { medium: string };
}

interface User {
  value: string;
  id: string;
  firstName: string;
  lastName: string;
  img_url: string;
}

export default function Home() {
  const [value, setValue] = useState("");
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const formattedUsers = randomUserList.results.map((user: RandomUser) => ({
      value: `${user.name.first} ${user.name.last}`,
      id: user.login.uuid,
      firstName: user.name.first,
      lastName: user.name.last,
      img_url: user.picture.medium,
    }));
    setUsers(formattedUsers);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center content-center p-24">
      <div className="flex flex-col items-center justify-center gap-12">
        <h1 className="mt-6 text-center text-3xl font-bold text-slate-900 dark:text-slate-100">shadcn/ui Virtualized Command</h1>
        <p className="mt-2 text-center text-xl text-slate-500 dark:text-slate-400">
          A combination of shadcn/ui, cmdk and react-window to create a virtualized command
          input.
        </p>
      </div>
      <div className="mt-10 flex w-full max-w-md flex-col items-center gap-6">
        <CommandDialogVirtual
          disabled={false}
          isPending={false}
          value={value}
          options={users}
          onValueChange={setValue}
        />
      </div>
      <footer className="mt-auto w-full max-w-md flex items-center justify-center gap-6">
        <a
          href="https://github.com/hakidoto/shadcn-ui-virtualized-command"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-md bg-slate-100 px-3 py-2 text-sm font-medium text-slate-900 dark:bg-slate-900 dark:text-slate-100"
        >
          <svg
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
          <span>GitHub</span>
        </a>
        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          Created by Hadid Garcia
        </p>
      </footer>
    </main>
  );
}
