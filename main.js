import prompt from "prompt-sync";
import mongoose from "mongoose";

await mongoose.connect("mongodb://localhost:27017/DanielDarougah-Assignment1");

const movieSchema = new mongoose.Schema({
  title: { type: String },
  director: { type: String },
  releaseYear: { type: Number },
  genres: [{ type: String }],
  ratings: [{ type: Number }],
  cast: [{ type: String }],
});

const movieModel = mongoose.model("Movies", movieSchema);

const p = prompt();

let runApp = true;

async function main() {
  console.log("Welcome to Daniel's Movie App!");

  while (runApp) {
    p("Press Enter to continue...");

    console.log("\nMenu");
    console.log("1. View all movies");
    console.log("2. Add a new movie");
    console.log(
      "3. Update a movie (Update title, director, release date, genres, ratings, or cast)"
    );
    console.log("4. Delete a movie");
    console.log("5. Exit");

    let input = p("Make a choice by entering a number: ");
    if (input === "1") {
      // View all movies
      console.log("Here is a list of all the movies");
      const movies = await movieModel.find({}, "title");
      if (movies.length === 0) {
        console.log("No movies available at the moment.");
      } else {
        movies.forEach((movie, index) => {
          console.log(`${index + 1}. ${movie.title}`);
        });
      }
    } else if (input === "2") {
      // Add a new movie
      console.log("Enter the details of the new movie");
      let title = p("Enter title: ");
      let director = p("Enter director: ");
      let releaseYear = p("Enter release year: ");
      let genre = p("Enter genre: ");
      let cast = p("Enter cast: ");

      await movieModel.create({
        title: title,
        director: director,
        releaseYear: releaseYear,
        genres: genre.split(","),
        cast: cast.split(","),
      });

      console.log("Movie added successfully!");
    } else if (input === "3") {
      // Update a movie
      console.log("Choose a movie to update");
      const movies = await movieModel.find({}, "title");
      if (movies.length === 0) {
        console.log("No movies available at the moment.");
      } else {
        movies.forEach((movie, index) => {
          console.log(`${index + 1}. ${movie.title}`);
        });
        let movieIndex = p("Enter the number of the movie to update: ");
        if (movieIndex >= 1 && movieIndex <= movies.length) {
          let titleToUpdate = movies[movieIndex - 1].title;
          const movieToUpdate = await movieModel.findOne({
            title: titleToUpdate,
          });
          if (!movieToUpdate) {
            console.log("Movie not found!");
            continue;
          }
          console.log("Previous data:");
          console.log(movieToUpdate);

          console.log("Choose a field to update:");
          console.log("1. Title");
          console.log("2. Director");
          console.log("3. Release Year");
          console.log("4. Genres");
          console.log("5. Ratings");
          console.log("6. Cast");
          let fieldToUpdate = p("Enter your choice: ");
          switch (fieldToUpdate) {
            case "1":
              let newTitle = p("Enter new title: ");
              movieToUpdate.title = newTitle;
              break;
            case "2":
              let newDirector = p("Enter new director: ");
              movieToUpdate.director = newDirector;
              break;
            case "3":
              let newReleaseYear = p("Enter new release year: ");
              movieToUpdate.releaseYear = newReleaseYear;
              break;
            case "4":
              let newGenres = p("Enter new genres (comma-separated): ");
              movieToUpdate.genres = newGenres.split(",");
              break;
            case "5":
              let newRatings = p("Enter new ratings (comma-separated): ");
              movieToUpdate.ratings = newRatings.split(",").map(parseFloat);
              break;
            case "6":
              let newCast = p("Enter new cast (comma-separated): ");
              movieToUpdate.cast = newCast.split(",");
              break;
            default:
              console.log("Invalid choice.");
              break;
          }
          await movieToUpdate.save();
          console.log("Movie updated successfully!");
        } else {
          console.log("Invalid choice.");
        }
      }
    } else if (input === "4") {
      // Delete a movie
      console.log("Choose a movie to delete");
      const movies = await movieModel.find({}, "title");
      if (movies.length === 0) {
        console.log("No movies available at the moment.");
      } else {
        movies.forEach((movie, index) => {
          console.log(`${index + 1}. ${movie.title}`);
        });
        let movieIndex = p("Enter the number of the movie to delete: ");
        if (movieIndex >= 1 && movieIndex <= movies.length) {
          let titleToDelete = movies[movieIndex - 1].title;
          const deletedMovie = await movieModel.deleteOne({
            title: titleToDelete,
          });
          if (deletedMovie.deletedCount === 1) {
            console.log("Movie deleted successfully!");
          } else {
            console.log("Something went wrong. Movie could not be deleted.");
          }
        } else {
          console.log("Invalid choice.");
        }
      }
    } else if (input === "5") {
      // Exit the application
      runApp = false;
      console.log("Thank you for using Daniels movie app... Goodbye!");
    } else {
      console.log("Please enter a number between 1 and 5.");
    }
  }
}

main();
