import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import type { LoaderFunction } from "@remix-run/node";
import type { Story } from "../types/types";

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.storyId, "Expected params.storyId");

  const baseUrl = process.env.BASE_URL;
  const apiKey = process.env.API_KEY;
  const hash = process.env.HASH;
  const ts = process.env.TS;

  const response = await fetch(
    `${baseUrl}/stories/${params.storyId}?apikey=${apiKey}&hash=${hash}&ts=${ts}`
  );

  if (!response.ok) {
    throw new Response("Not Found", { status: 404 });
  }

  const {
    data: { results: storyData },
  }: { data: { results: Story[] } } = await response.json();

  if (!storyData.length) {
    throw new Response("story Not Found", { status: 404 });
  }

  return Response.json({ story: storyData[0] });
};

export default function StoryDetail() {
  const { story } = useLoaderData<{ story: Story }>();

  console.log({ story });

  return (
    <div
      id="story"
      className="max-w-3xl mx-auto mt-8 bg-white shadow-md rounded-lg p-6"
    >
      <h1>{story.title}</h1>
      {story.thumbnail && (
        <img
          src={`${story.thumbnail.path}.${story.thumbnail.extension}`}
          alt={story.title}
          className="w-auto h-80 rounded-lg border border-gray-300"
        />
      )}
      <p>{story.description}</p>
    </div>
  );
}
