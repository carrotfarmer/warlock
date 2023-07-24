import * as React from "react";
import {
  ExitIcon,
  RocketIcon,
} from "@radix-ui/react-icons";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/Command";

import type { ExtendedSite } from "@/lib/types";
import { HomeIcon, PlusIcon, SearchIcon } from "lucide-react";
import { Inter } from "next/font/google";
import { useRouter } from "next/navigation"
import { api } from "@/utils/api";
import { signOut } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] })

export const CommandMenu: React.FC = ({}) => {
  const [open, setOpen] = React.useState(false);

  const router = useRouter();

  const { data: sites } = api.site.getSites.useQuery()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && e.metaKey) {
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <div className="h-10 w-72 rounded-lg bg-gray-900 hover:bg-gray-800 cursor-pointer" onClick={() => setOpen(true)}>
        <p className="flex justify-start px-4 pt-2 text-sm text-muted-foreground">
          <div className="pr-2 inline-block align-middle pt-[2px]">
          <SearchIcon className="h-4 w-4" />
          </div>
          Press{" "}
          <div className="pl-2">
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
          <div className="pl-2">to search</div>
        </p>
        <CommandDialog open={open} onOpenChange={setOpen}>
          {/* eslint-disable-next-line */}
          {/* @ts-ignore */}
          <CommandInput placeholder="Type a command or search..." className={inter.className} />
          <CommandList className={inter.className}>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Quick Links">
              <CommandItem onSelect={() => router.push("/")}>
                <HomeIcon className="mr-2 h-4 w-4" />
                <span>Home</span>
              </CommandItem>
              <CommandItem onSelect={() => router.push("/create")}>
                <PlusIcon className="mr-2 h-4 w-4" />
                <span>Create a Site</span>
              </CommandItem>
              <CommandItem onSelect={() => void signOut()}>
                <ExitIcon className="mr-2 h-4 w-4" />
                <span>Sign Out</span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Sites">
              {(sites ?? []).map((site: ExtendedSite) => (
                <CommandItem key={site.id} onSelect={() => router.push(`/${site.id}`)}>
                  <RocketIcon className="mr-2 h-4 w-4" />
                  <span>{site.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </div>
    </>
  );
};
