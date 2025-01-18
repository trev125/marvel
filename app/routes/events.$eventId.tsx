import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import type { LoaderFunction } from "@remix-run/node";
import type { Event } from "../types/types";

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.eventId, "Expected params.eventId");

  const baseUrl = process.env.BASE_URL;
  const apiKey = process.env.API_KEY;
  const hash = process.env.HASH;
  const ts = process.env.TS;

  const response = await fetch(
    `${baseUrl}/events/${params.eventId}?apikey=${apiKey}&hash=${hash}&ts=${ts}`
  );

  if (!response.ok) {
    throw new Response("Not Found", { status: 404 });
  }

  const {
    data: { results: eventData },
  }: { data: { results: Event[] } } = await response.json();

  if (!eventData.length) {
    throw new Response("Event Not Found", { status: 404 });
  }

  return Response.json({ event: eventData[0] });
};

export default function EventDetail() {
  const { event } = useLoaderData<{ event: Event }>();

  console.log({ event });

  return (
    <div
      id="event"
      className="max-w-3xl mx-auto mt-8 bg-white shadow-md rounded-lg p-6"
    >
      <h1>{event.title}</h1>
      {event.thumbnail && (
        <img
          src={`${event.thumbnail.path}.${event.thumbnail.extension}`}
          alt={event.title}
          className="w-auto h-80 rounded-lg border border-gray-300"
        />
      )}
      <p>{event.description}</p>
    </div>
  );
}
