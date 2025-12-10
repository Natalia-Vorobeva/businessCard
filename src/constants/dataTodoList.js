// export const codeFilesMovieTickets = [
export const codeFiles = [
	{
		id: 1,
		name: 'constants.js',
		language: 'js',
		content: `export const DAY_MILSEC = 24 * 60 * 60 * 1000


export const PAST_CLASS = 'bg-black text-white cursor-pointer'	
`
	},
	{
		id: 2,
		name: 'initialFunctionsMovieTheaters.js',
		language: 'javascript',
		content: `

//  СЧЕТЧИК ЗАЛОВ, В КОТОРЫХ ИДЕТ ВЫБРАННЫЙ ФИЛЬМ
export const counterHalls = (elements, item) => {
  const counter = elements
    .map((el, i) => el.includes(item) ? i + 1 : null)
    .filter(index => index !== null)

  return counter.length === elements.length ? [999] : counter
}`
	},
	{
		id: 3,
		name: 'dataPeterburg.js',
		language: 'javascript',
		content: `
			import { PETERBURG_MOVIE_THEATERS } from "../constants/cinemaСhain/cities/peterburgConstants/peterburgConstants"
import { movieTheaters } from "../constants/cinemaСhain/functions"

export const dbPeterburg = movieTheaters(PETERBURG_MOVIE_THEATERS)`
	},
	{
		id: 4,
		name: 'movieTheaters.js',
		language: 'javascript',
		content: `const sessionsStandard = () => {
	let arr = []
	for (let i = 0; i < 13; i += 2) {
		let s = 10 + i
		arr.push(s)
	}
	return arr
}

const cinemaFilms = (data) => {
	let arr = []
	data.map((item) => {
		const obj = {
			film: item.name,
			sessions: item.sessions == 'standard' ? sessionsStandard() : item.sessions,
			reserved: []
		}
		arr.push(obj)
	})
	return arr
}

const cinemaHalls = (data) => {
	let arr = []
	data.halls.map((item) => {
		const obj = {
			hall: item.hall,
			units: item.units,
			films: cinemaFilms(data.film_data)
		}
		arr.push(obj)
	})
	return arr
}

export const movieTheaters = (data) => {
	let arr = []
	data.map((item) => {
		const obj = {
			movieTheaters: item.name,
			films: item.films,
			halls_films: item.halls_films,
			halls: cinemaHalls(item)
		}
		arr.push(obj)
	})
	return arr
}`
	}
]