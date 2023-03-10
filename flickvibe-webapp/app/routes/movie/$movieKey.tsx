import React, { useEffect } from 'react'
import Ratings, { RatingsProps } from '~/ui/Ratings'
import InfoBox from '~/ui/InfoBox'
import { useFetcher, useParams } from '@remix-run/react'
import Providers from '~/ui/Providers'
import { MetaFunction } from '@remix-run/node'
import YouTube from 'react-youtube'

export const meta: MetaFunction = () => {
  return {
    title: 'flickvibe',
    description: 'All movie and tv show ratings and streaming providers on the same page',
  }
}

export default function MovieDetails() {
  const { movieKey = '' } = useParams()
  const movieId = movieKey.split('-')[0]
  const fetcher = useFetcher()

  useEffect(() => {
    fetcher.submit(
      { movieId },
      {
        method: 'get',
        action: '/api/ratings/movie',
      }
    )
  }, [movieId])
  console.log(fetcher.data)

  const details = fetcher.data?.details || {}
  const ratings: RatingsProps = fetcher.data?.ratings || {}
  const providers = details['watch/providers'] || {}

  const { title, backdrop_path, poster_path, release_date, videos } = details
  const year = release_date?.split('-')?.[0]

  const videoId = videos?.results?.length ? videos.results[0].key : null
  const videoOpts = {
    height: '390',
    width: '640',
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 0,
    },
  }

  return (
    <div className="mt-8">
      {fetcher.state === 'idle' ?
        <div className="relative p-3 flex h-96 bg-cover before:absolute before:top-0 before:bottom-0 before:right-0 before:left-0 before:bg-black/[.78]" style={{backgroundImage: `url('https://www.themoviedb.org/t/p/w1920_and_h800_multi_faces/${backdrop_path}')`}}>
          <div className="relative flex-none w-24 sm:w-60">
            <img
              className="block rounded-md"
              src={`https://www.themoviedb.org/t/p/w300_and_h450_bestv2${poster_path}`}
              alt={`Poster for ${title}`}
              title={`Poster for ${title}`}
            />
          </div>
          <div className="relative flex-1 pl-4">
            <h2 className="mb-6 text-2xl">
              <span className="text-3xl font-bold pr-2">{title}</span> ({year})
            </h2>
            <div className="">
              <Ratings {...ratings} />
              <Providers providers={providers} />
              {videoId && (
                <div className="mt-8">
                  <div className="mb-2 text-lg font-bold">Trailer</div>
                  <YouTube videoId={videoId} opts={videoOpts} />
                </div>
              )}
            </div>
          </div>
        </div>
      :
        <InfoBox text="Inititalizing movie data..." />
      }
    </div>
  )
}