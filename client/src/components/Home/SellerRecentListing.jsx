import { Link } from "react-router-dom";

export default function CreateListing(props) {
  const { recentListings } = props;
  return (
    <section>
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:items-stretch">
          <div className="grid place-content-center rounded bg-gray-100 p-6 sm:p-8">
            <div className="mx-auto max-w-md text-center lg:text-left">
              <header>
                <h2 className="text-xl font-bold text-gray-900 sm:text-3xl">
                  Selling Houses, Creating Dreams
                </h2>

                <p className="mt-4 text-gray-500">
                  Catch up with what you left last time!
                </p>
              </header>

              <Link
                to={"/personal"}
                className="mt-8 inline-block rounded border border-gray-900 bg-gray-900 px-12 py-3 text-sm font-medium text-white transition hover:shadow focus:outline-none focus:ring"
              >
                Recent listings
              </Link>
            </div>
          </div>

          <div className="lg:col-span-2 lg:py-8">
            <ul className="grid grid-cols-2 gap-4">
              {recentListings.map((listing, index) => (
                <li key={index}>
                  <Link to={`/listing/${listing._id}`} className="group block">
                    <img
                      src={listing.imageUrls[0]}
                      alt=""
                      className="aspect-square w-full rounded object-cover"
                    />

                    <div className="mt-3">
                      <h3 className="font-medium text-gray-900 group-hover:underline group-hover:underline-offset-4">
                        {listing.name}
                      </h3>

                      <p className="mt-1 text-sm text-gray-700">
                        ${listing.regularPrice}
                        {listing.type === "rent" && " / month"}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
