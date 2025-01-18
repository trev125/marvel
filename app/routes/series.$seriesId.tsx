import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import type { LoaderFunction } from "@remix-run/node";
import type { Series } from "../types/types";

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.seriesId, "Expected params.seriesId");

  const baseUrl = process.env.BASE_URL;
  const apiKey = process.env.API_KEY;
  const hash = process.env.HASH;
  const ts = process.env.TS;

  const response = await fetch(
    `${baseUrl}/series/${params.seriesId}?apikey=${apiKey}&hash=${hash}&ts=${ts}`
  );

  if (!response.ok) {
    throw new Response("Not Found", { status: 404 });
  }

  const {
    data: { results: seriesData },
  }: { data: { results: Series[] } } = await response.json();

  if (!seriesData.length) {
    throw new Response("series Not Found", { status: 404 });
  }

  return Response.json({ series: seriesData[0] });
};

export default function SeriesDetail() {
  const { series } = useLoaderData<{ series: Series }>();

  console.log({ series });

  return (
    <div
      id="series"
      className="max-w-3xl mx-auto mt-8 bg-white shadow-md rounded-lg p-6"
    >
      <h1>{series.title}</h1>
      <img
        src={`${series.thumbnail.path}.${series.thumbnail.extension}`}
        alt={series.title}
        className="w-auto h-80 rounded-lg border border-gray-300"
      />
      <p>{series.description}</p>
    </div>
  );
}
