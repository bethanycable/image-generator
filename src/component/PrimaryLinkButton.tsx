import clsx from "clsx";
import Link, { type LinkProps } from "next/link"
import { type ReactNode } from "react"

function PrimaryLinkButton (props: LinkProps & {children: ReactNode; className?: string}) {
  return (
    <Link 
      {...props} 
      className={clsx(
        "rounded bg-blue-400 px-4 py-2 hover:bg-blue-500 self",
        props.className ?? ""
      )}
    >
      {props.children}
    </Link>
  )
}

export default PrimaryLinkButton;
