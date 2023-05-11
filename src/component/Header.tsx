import { signIn, signOut, useSession } from "next-auth/react";

import Button from "./Button";
import PrimaryLink from "./PrimaryLink"
import { useBuyCredits } from "~/hooks/useBuyCredits";

function Header () {
  const { buyCredits } = useBuyCredits();
  const session = useSession();

  const isLoggedIn = !!session.data;

  return (
    <header className="dark:bg-gray-800">
      <div className="container mx-auto flex justify-between items-center h-16 px-4">
        <PrimaryLink href="/">Bs Cover Generator</PrimaryLink>
        <ul>
          <li>
            <PrimaryLink href="/generate">Generate</PrimaryLink>
          </li>
        </ul>
        <ul className="flex gap-4">
          {isLoggedIn && (
            <>
              <li>
                <Button 
                  onClick={() => {
                    buyCredits().catch(console.error);
                  }}
                >
                  Buy Credits
                </Button>
              </li>
              <li>
                <Button 
                    variant="secondary"
                    onClick={() => { 
                      signOut().catch(console.error);
                    }}
                  >
                    Logout
                  </Button>
              </li>
            </>
          )}
          { !isLoggedIn && 
              <Button 
                onClick={() => { 
                  signIn().catch(console.error);
                }}
              >
                Login
              </Button>
            }
        </ul>
      </div>
    </header>
  )
}

export default Header
