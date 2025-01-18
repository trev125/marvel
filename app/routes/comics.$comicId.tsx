/**
 * To see more comments about what the top level functions do, see the contacts.$contactId.tsx file.
 */

import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import type { LoaderFunction } from "@remix-run/node";
import type { Comic } from "../types/types";

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.comicId, "Expected params.comicId");

  const baseUrl = process.env.BASE_URL;
  const apiKey = process.env.API_KEY;
  const hash = process.env.HASH;
  const ts = process.env.TS;

  const response = await fetch(
    `${baseUrl}/comics/${params.comicId}?apikey=${apiKey}&hash=${hash}&ts=${ts}`
  );

  if (!response.ok) {
    throw new Response("Not Found", { status: 404 });
  }

  const {
    data: { results: comicData },
  }: { data: { results: Comic[] } } = await response.json();

  if (!comicData.length) {
    throw new Response("Comic Not Found", { status: 404 });
  }

  return Response.json({ comic: comicData[0] });
};

export default function ComicDetail() {
  const { comic } = useLoaderData<{ comic: Comic }>();

  return (
    <div
      id="comic"
      className="max-w-3xl mx-auto mt-8 bg-white shadow-md rounded-lg p-6"
    >
      <h1>{comic.title}</h1>
      <img
        src={`${comic.thumbnail.path}.${comic.thumbnail.extension}`}
        alt={comic.title}
        className="w-auto h-80 rounded-lg border border-gray-300"
      />
      <p>{comic.description}</p>
    </div>
  );
}
