const notFoundResponse = () =>
  new Response("Not found. Start at /llms.txt.\n", {
    status: 404,
    headers: {
      "cache-control": "no-store",
      "content-type": "text/plain; charset=utf-8",
    },
  })

export const GET = notFoundResponse
export const HEAD = notFoundResponse
