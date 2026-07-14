import { readFileSync } from "node:fs"
import { join } from "node:path"
import { ClientLibrariesInteractive } from "./client-libraries-interactive"

type ClientLibrariesSectionProps = {
  className?: string
}

const CLIENT_LIBRARIES_BOARD_PATH = join(process.cwd(), "public/art/client-libraries-board.svg")
const CLIENT_LIBRARIES_BOARD = readFileSync(CLIENT_LIBRARIES_BOARD_PATH, "utf8")

export const ClientLibrariesSection = ({ className }: ClientLibrariesSectionProps) => (
  <ClientLibrariesInteractive className={className} boardMarkup={CLIENT_LIBRARIES_BOARD} />
)
