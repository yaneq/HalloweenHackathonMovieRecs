import { SyntheticEvent, useState } from "react";
import CircleLoader from "react-spinners/CircleLoader";
import Modal from "react-modal";
import { IMovie } from "types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    width: "90%",
    height: "80%",
    transform: "translate(-50%, -50%)",
    borderRadius: "5px",
  },
};
export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [loadedOnce, setLoadedOnce] = useState(false);
  const [query, setQuery] = useState("");
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<IMovie | undefined>(
    undefined
  );

  const openModal = (movie_title: string) => {
    const movieSelection = recommendedMovies.filter((movie: IMovie) => {
      return movie.title === movie_title;
    });
    console.log(movieSelection);
    setSelectedMovie(movieSelection[0]);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const getRecommendations = async (e: SyntheticEvent) => {
    e.preventDefault();

    // Check Inputs
    if (query === "") {
      alert("Please let us know what you'd like to learn!");
      return;
    }

    setIsLoading(true);

    await fetch("/api/recommendations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
      }),
    })
      .then((res) => {
        console.log(res);
        if (res.ok) return res.json();
      })
      .then((recommendations) => {
        console.log(recommendations.data.Get.Movie);
        setRecommendedMovies(recommendations.data.Get.Movie);
      });

    setIsLoading(false);
    setLoadedOnce(true);
  };

  return (
    <div className="h-screen flex flex-col justify-between bg-gray-100">
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div className="flex justify-between">
          <h3 className="mt-2 text-lg font-semibold text-gray-700">
            {selectedMovie?.title}
          </h3>
          <Button
            className="hover:font-bold rounded hover:bg-gray-700 p-2 w-20 hover:text-white "
            onClick={closeModal}
          >
            Close
          </Button>
        </div>
        <div>
          <div className="flex justify-center py-10">
            <div className="w-48 h-72">
              <img
                src={selectedMovie?.poster}
                alt={"Poster of the movie " + selectedMovie?.poster}
                className="w-full h-full rounded-lg shadow-lg"
              />
            </div>
          </div>
          <div>
            {/* <p className="mt-1 text-gray-500">
              <span className="font-bold">Authors</span>:{" "}
              {selectedMovie?.authors}
            </p>
            <p>
              <span className="font-bold">Genre</span>:{" "}
              {selectedBook?.categories}
            </p>
            <p>
              <span className="font-bold">Rating</span>:{" "}
              {selectedBook?.average_rating}
            </p>
            <p>
              <span className="font-bold">Publication Year</span>:{" "}
              {selectedBook?.published_year}
            </p> */}
            <br />
            <p>{selectedMovie?.summary}</p>

            {/* <div className="flex justify-center"> */}
            {/* <a
                className="hover:animate-pulse"
                target="_blank"
                href={"https://www.amazon.com/s?k=" + selectedBook?.isbn10}
              >
                <img
                  className="w-60"
                  src="https://kentuckynerd.com/wp-content/uploads/2019/05/amazon-buy-now-button.jpg"
                />
              </a> */}
            {/* </div> */}
          </div>
        </div>
      </Modal>
      <div className="mb-auto py-10 px-4 bg-gray-100">
        <div className="container mx-auto">
          <h1 className="text-3xl font-black mb-6 text-center">
            Halloween Movie Advisor
          </h1>

          <form
            id="recommendation-form"
            className="mb-10"
            onSubmit={getRecommendations}
          >
            <div className="mb-4">
              <label
                htmlFor="favorite-books"
                className="block text-gray-700 font-bold mb-2"
              >
                What are you afraid of?
              </label>
              <Input
                type="text"
                id="favorite-books"
                name="favorite-books"
                placeholder="Jellyfish..."
                className="block w-full px-4 py-2 border border-gray-300 bg-white rounded-md shadow-sm "
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                }}
              />
            </div>
            <Button
              className="bg-black text-white w-full rounded-md hover:bg-gray-800 hover:text-white"
              disabled={isLoading}
              type="submit"
              variant="outline"
            >
              Get Scared
            </Button>
          </form>

          {isLoading ? (
            <div className="w-full flex justify-center h-60 pt-10">
              <CircleLoader
                color={"#000000"}
                loading={isLoading}
                size={100}
                aria-label="Loading"
                data-testid="loader"
              />
            </div>
          ) : (
            <>
              {loadedOnce ? (
                <>
                  <h2 className="text-2xl font-bold mb-4 text-center">
                    Recommended Movies
                  </h2>
                  <div
                    id="recommended-books"
                    className="flex overflow-x-scroll pb-10 hide-scroll-bar"
                  >
                    {/* <!-- Recommended books dynamically added here --> */}
                    <section className="container mx-auto mb-12">
                      <div className="flex flex-wrap -mx-2">
                        {recommendedMovies.map((movie: IMovie) => {
                          return (
                            <div
                              key={movie.title}
                              className="w-full md:w-1/3 px-2 mb-4 animate-pop-in"
                            >
                              <div className="bg-white p-6 flex items-center flex-col">
                                <h3 className="text-xl font-semibold mb-4 line-clamp-1">
                                  {movie.title}
                                </h3>
                                <div className="w-48 h-72">
                                  <img
                                    src={movie.poster}
                                    alt={"Poster of the movie " + movie.title}
                                    className="w-full h-full rounded-lg shadow-lg"
                                  />
                                </div>
                                {/* <p className="mt-4 text-gray-500 line-clamp-1">
                                  {book.authors}
                                </p> */}
                                {/* <div className="flex">
                                  <Button
                                    className="bg-black text-white w-full rounded-md hover:bg-gray-800 hover:text-white"
                                    type="submit"
                                    variant="outline"
                                    onClick={() => {
                                      openModal(book.title);
                                    }}
                                  >
                                    Learn More
                                  </Button>
                                </div> */}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </section>
                  </div>
                </>
              ) : (
                <div className="w-full flex justify-center h-60 pt-10"></div>
              )}
            </>
          )}
        </div>
      </div>

      <footer className="justify-center items-center bg-gray-600 text-white h-10 flex">
        Made with ❤️ by &nbsp;
        <a
          href="https://x.com/yaneq/"
          target="_blank"
          className="underline text-blue-200"
        >
          @yaneq
        </a>
        &nbsp;- forked from&nbsp;
        <a
          href="https://github.com/weaviate/BookRecs"
          target="_blank"
          className="underline text-blue-200"
        >
          BookRecs
        </a>
        &nbsp;by&nbsp;
        <a
          href="https://x.com/aj__chan/"
          target="_blank"
          className="underline text-blue-200"
        >
          @aj__chan
        </a>
        &nbsp;-&nbsp;built with&nbsp;
        <a
          target="_blank"
          href="https://weaviate.io/"
          className="underline text-blue-200"
        >
          Weaviate
        </a>
      </footer>
    </div>
  );
}
