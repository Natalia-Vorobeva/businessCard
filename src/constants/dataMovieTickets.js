// export const codeFilesMovieTickets = [
export const codeFiles = [
	{
		id: 1,
		name: 'App.jsx',
		language: 'jsx',
		content: `import { useEffect, useMemo, useState } from 'react'
import { counterHalls, DATA, INITIAL_DATA } from './middlewares/initialFunctions.js'
import { db } from './middlewares/getDates'
import { arrayCity } from './middlewares/initialFunctions.js'
import { CURRENT_DATE, MAX_OBJECT_DATES, INITIAL_SELECTED, INITIAL_RESERVATION, INFO, INFO_PAST, 
INFO_MODAL, HALL_INFO } from './constants/constants.js'
import { counter, editObject, handlePlaces } from './middlewares/getDates'
import { newDate } from './middlewares/getDates'
import { stringDate, stringTime } from './middlewares/getDates'
import CinemaHall from './components/CinemaHall/CinemaHall.jsx'
import ListFilms from './components/ListFilms/ListFilms.jsx'
import Path from './components/Path/Path.jsx'
import Ticket from './components/Ticket/Ticket.jsx'
import Modal from './components/Modal/Modal.jsx'
import Schedule from './components/Schedule/Schedule.jsx'
import HallList from './components/HallList/HallList.jsx'
import InfoMessage from './components/InfoMessage/InfoMessage.jsx'
import Header from './components/Header/Header.jsx
function App() {
	const { d, m, y } = CURRENT_DATE
	const [dates, setDates] = useState(db)
	const [dataBase, setDataBase] = useState([])
	const [dataCities, setDataCities] = useState(DATA)
	const [modifiedArray, setModifiedArray] = useState(dataCities)
	const [reservation, setReservation] = useState({ ...INITIAL_RESERVATION })
	const [selectedData, setSelectedData] = useState(INITIAL_SELECTED)
	const [currentArrPlaces, setCurrentArrPlaces] = useState([])
	const [overlay, setOverlay] = useState(true)
	const [sessionList, setSessionList] = useState([])
	const [ticket, setTicket] = useState(false)
	const [info, setInfo] = useState('')
	const [infoPast, setInfoPast] = useState('')
	const [activeDate, setActiveDate] = useState(false)
	const [activeHall, setActiveHall] = useState(null + "/cinemaHall")
	const [selectFilmModal, setSelectFilmModal] = useState(false)
	const [listActiveHalls, setListActiveHalls] = useState([])
	const [hallInfo, setHallInfo] = useState('')
	const [dataCurrentTheatre, setDataCurrentTheatre] = useState(INITIAL_DATA)
	const [iCity, setICity] = useState(0)
	const [iCinema, setICinema] = useState(0)

	// * здесь пересчет дат при первой загрузке страницы
	useEffect(() => {
		const storedData = localStorage.getItem("date-tickets")
		if (!storedData) {
			localStorage.setItem("date-tickets", JSON.stringify(dates))
			setDataBase(db)
			return
		}
		const parsedArray = JSON.parse(storedData)
		const today = parsedArray.find(el => el.day === d && el.month === m && el.year === y)
		let currentObject = null

		const updatedArray = parsedArray.map(el => {
			const isToday = el.day === d && el.month === m && el.year === y
			if (isToday) {
				currentObject = el
			}
			return { ...el, state: isToday ? 'current' : '' }
		})

		const count = counter(updatedArray, currentObject);

		if (count < MAX_OBJECT_DATES) {
			const maxId = Math.max(...updatedArray.map(obj => obj.id))
			const toAddCount = MAX_OBJECT_DATES - count
			const paramNewDate = MAX_OBJECT_DATES - toAddCount;
			const newDates = newDate(toAddCount + 1, paramNewDate, maxId)
			const trimmedArray = updatedArray.slice(toAddCount)

			const finalArray = [...trimmedArray, ...newDates]
			setDataBase(finalArray)
			localStorage.setItem("date-tickets", JSON.stringify(finalArray))

		} else {
			setDataBase(updatedArray)
			localStorage.setItem("date-tickets", JSON.stringify(updatedArray))
		}
	}, [d, m, y, dates])

	const indexActive = dataBase.findIndex(function (el) {
		return el.state === 'current'
	})
	// * ключ для пересчета занятых мест по фильму, сеансу и залу для useMemo
	const [observer, setObserver] = useState(0)

	// * пересчет занятыx мест заразные даты и сеансы
	const visiblePlaces = useMemo(() => handlePlaces(observer, dataCurrentTheatre.halls, reservation.film, reservation.hall, reservation.day, reservation.hour),
		[observer, dataCurrentTheatre.halls, reservation.film, reservation.hall, reservation.day, reservation.hour])

		const handleClickCity = (item) => {
		const i = dataCities.findIndex(el => el.city === item)
		const { c, f, currentTheatre, theatre, h } = arrayCity(i, iCinema, dataCities)
		const obj = {
			city: c,
			dataTheatre: f,
			cinema: currentTheatre,
			cinemaList: theatre,
			halls: h
		}
		setDataCurrentTheatre(obj)
		setICity(i)
		setICinema(0)
		setReservation(INITIAL_RESERVATION)
		setSelectedData(INITIAL_SELECTED)
		setObserver(0)
	}

	const handleClickCinema = (item) => {
		const i = dataCurrentTheatre.cinemaList.findIndex(el => el === item)
		const { c, f, currentTheatre, theatre, h } = arrayCity(iCity, i, dataCities)

		setDataCurrentTheatre({
			city: c,
			dataTheatre: f,
			cinema: currentTheatre,
			cinemaList: theatre,
			halls: h
		})
		setICinema(i)
		setReservation(INITIAL_RESERVATION)
		setSelectedData(INITIAL_SELECTED)
		setObserver(0)
	}

		const handleClickFilms = (item) => {
		const counter = counterHalls(dataCurrentTheatre.dataTheatre.halls_films, item.film)
		setListActiveHalls(counter)
		setInfo('')
		setHallInfo('')
		setSessionList([])
		setObserver(1)
		if (selectFilmModal == true) {
			setSelectedData((prev) => {
				return { ...prev, film: true, place: false, date: false, hour: false, hall: true }
			})
			setReservation(() => {
				return { ...INITIAL_RESERVATION, film: item.film, hall: item.hall }
			})
		} else {
			if (counter.includes(999)) {
				setSelectedData((prev) => {
					return { ...prev, film: true, hall: true, place: false, date: false, hour: false }
				})
				setReservation(() => {
					return { ...INITIAL_RESERVATION, film: item.film, hall: 1 }
				})
			} else if (counter.length > 0) {
				setSelectedData((prev) => {
					return { ...prev, film: true, hall: true, place: false, date: false, hour: false }
				})
				setReservation(() => {
					return { ...INITIAL_RESERVATION, film: item.film, hall: counter[0] }
				})
			}
		}
		setCurrentArrPlaces([])
	}

		const handleClickSession = (item, time, ind) => {

		setCurrentArrPlaces([])
		reservation.hour == null && setObserver(prev => prev + 1)

		if (ind >= indexActive) {
			setActiveDate(true)
			setInfoPast('')
		} else if (ind < indexActive) {
			setInfo('')
			setInfoPast(INFO_PAST)
			setActiveDate(false)
		}

		if (reservation.day === item.day) {
			setReservation((prev) => {
				return { ...prev, date: stringDate(item), time: stringTime(time), hour: time }
			})
			setSelectedData((prev) => {
				return { ...prev, date: true, hour: true }
			})
		} else {
			setReservation((prev) => {
				return { ...prev, day: item.day, date: stringDate(item), time: stringTime(time), hour: time }
			})
			setSelectedData((prev) => {
				return { ...prev, date: true, hour: true }
			})
		}
	}

	const handleClickDate = (data, index) => {
		if (reservation.film !== '') {
			if (reservation.hall == null) {
				if (listActiveHalls.includes(999)) {
					const filter = dataCurrentTheatre.halls[0].films.filter(el => el.film == reservation.film)[0].sessions
					setSessionList(filter)
					setReservation((prev) => {
						return { ...prev, hall: 1, day: data.day }
					})
					setSelectedData((prev) => {
						return { ...prev, hall: true }
					})
				} else {
					const indexHall = listActiveHalls[0]
					const hallData = dataCurrentTheatre.halls.find(h => h.hall === indexHall)
					if (hallData) {
						const filter = hallData.films.filter(el => el.film === reservation.film)[0]?.sessions || []
						setSessionList(filter)
						setReservation((prev) => {
							return { ...prev, hall: indexHall, day: data.day }
						})
						setSelectedData((prev) => {
							return { ...prev, hall: true }
						})
					}
				}
					} else {
				const h = reservation.hall
				const filter = dataCurrentTheatre.halls[h].films.filter(el => el.film == reservation.film)[0].sessions
				setSessionList(filter)
				setReservation((prev) => {
					return { ...prev, hall: 1, day: data.day }
				})
				setSelectedData((prev) => {
					return { ...prev, hall: true }
				})
			}
		} else {
			setInfo(INFO)
		}
		if (index >= indexActive) {
			setActiveDate(true)
			setInfoPast('')
		} else if (index < indexActive) {
			setInfo('')
			setInfoPast(INFO_PAST)
			setActiveDate(false)
		}
	}

		const handleInfoHalls = (num) => {
		const s = listActiveHalls.includes(num)
		if (s == true) {
			setHallInfo("")
		} else {
			setHallInfo(HALL_INFO)
		}
	}

		const visibleHall = (num) => {
		setCurrentArrPlaces([])
		if (reservation.film == "") {
			setHallInfo('')
		} else if (listActiveHalls.includes(999)) {
			setHallInfo('')
		} else {
			handleInfoHalls(num)
		}
		setActiveHall(num + "/cinemaHall")
		reservation.hall == null && setObserver(prev => prev + 1)
		reservation.film == "" && setObserver(prev => prev)
		setSelectedData((prev) => {
			return { ...prev, hall: true }
		})
		setReservation((prev) => {
			return { ...prev, hall: num }
		})
	}

	const openModalPlaces = (units, serialNumber) => {
		setHallInfo('')
		setOverlay(false)

		if (activeDate == false) {
			setInfoPast(INFO_MODAL)
		} else if (activeDate == true) {
			setObserver(prev => prev + 1)
			setSelectedData((prev) => {
				return { ...prev, hall: true, placeModal: true }
			})
			setReservation((prev) => {
				return { ...prev, hall: serialNumber, units: units, placeModal: true }
			})
		}
	}

	const handleCloseModal = () => {
		setOverlay(true)
		if (currentArrPlaces.length === 0) {
			setSelectedData((prev) => {
				return { ...prev, placeModal: false }
			})
		} else
			if (currentArrPlaces?.length > 0) {
				setSelectedData((prev) => {
					return { ...prev, place: true, placeModal: false }
				})
			}
	}

	const handleBookSeats = () => {
		if (ticket == false) {
			const n = editObject(dataCities, reservation.day, reservation.hall, currentArrPlaces, reservation.film, reservation.hour, dataCurrentTheatre.city, dataCurrentTheatre.cinema)
			setModifiedArray(n)
			setTicket(true)
		} else {
			localStorage.setItem('CITIES_DB', JSON.stringify(modifiedArray))
			setDataCities(modifiedArray)
			setReservation(INITIAL_RESERVATION)
			setSelectedData(INITIAL_SELECTED)
			setCurrentArrPlaces([])
			setObserver(0)
			setSessionList([])
			setTicket(false)
			setHallInfo('')
			const { h } = arrayCity(iCity, iCinema, modifiedArray)
			setDataCurrentTheatre((prev) => { return { ...prev, halls: h } }
			)
		}
	}

		return (
		<div className={\`px-4 pr-10 pl-2 relative w-[100%] text-[3rem] leading-[0.6] grid grid-rows-[auto_1fr_1fr] gap-8 min-h-screen \${selectedData.placeModal || selectFilmModal ? 'max-h-[100vh] overflow-y-hidden' : ''}\`} >
			{/* <div className={\`relative w-full min-h-[100vh] p-2 text-[3rem] leading-[0.6] grid grid-rows-[auto_1fr_1fr] gap-8 min-h-screen \${selectedData.placeModal || selectFilmModal ? 'max-h-[100vh] overflow-y-hidden' : ''}\`} >}
			{ticket && <Ticket />}
			<div className="max-w-[100%]">
				<Header
					ticket={ticket}
					currentCity={dataCurrentTheatre.city}
					handleClickCity={handleClickCity}
					currentCinema={dataCurrentTheatre.cinema}
					handleClickCinema={handleClickCinema}
					cinemaList={dataCurrentTheatre.cinemaList}
				/>
			</div>
			<div className='w-[100%]'>
				<h1 className={\`text-[4rem] py-6 lg:text-[10rem] leading-[0.8] text-right pl-[10%] \${selectedData.placeModal ? ' overflow-y-hidden' : ''} \${ticket ? ' hidden' : ''}\`}>Билетная касса</h1>
				<div className='flex flex-wrap md:flex-nowrap w-full  gap-2 sm:gap-8'>
					<ListFilms
						films={dataCurrentTheatre.dataTheatre}
						ticket={ticket}
						handleClickFilms={handleClickFilms}
						selectFilmModal={selectFilmModal}
						setSelectFilmModal={setSelectFilmModal}
						setListActiveHalls={setListActiveHalls}
					/>

					<div className='basis-[40vw]'>
						<HallList
							info={hallInfo}
							halls={dataCurrentTheatre.halls}
							visibleHall={visibleHall}
							reservation={reservation}
							listActiveHalls={listActiveHalls}
						/>

						{
							dataCurrentTheatre.halls.map((item, index) => {
								return <CinemaHall key={\`\${index + 1}/cinemaHall\`} id={\`\${index + 1}/cinemaHall\`}
									hallInfo={hallInfo}
									reservation={reservation}
									currentDbPlaces={visiblePlaces || undefined}
									currentArrPlaces={currentArrPlaces}
									openModalPlaces={openModalPlaces}
									serialNumber={item.hall}
									units={item.units}
									overlay={overlay}
									ticket={ticket}
									setCurrentArrPlaces={setCurrentArrPlaces}
									activeDate={activeDate}
									activeHall={activeHall}
								/>
							})
						}

							</div>
				</div>

				<Path currentArrPlaces={currentArrPlaces} reservation={reservation} selectedDate={selectedData.date}
					activeDate={activeDate}
					ticket={ticket}
					selectedPlace={selectedData.place}
					selectedFilm={selectedData.film}
					selectedHall={selectedData.hall}
					handleBookSeats={handleBookSeats} />

				<InfoMessage info={info} infoPast={infoPast} />
			</div>

			<div className='flex pt-2 w-[100%] gap-6'>
				<Schedule
					data={dataCurrentTheatre.halls}
					dataBase={dataBase}
					listActiveHalls={listActiveHalls}
					indexActive={indexActive}
					sessionList={sessionList}
					reservation={reservation}
					handleClickDate={handleClickDate}
					handleClickSession={handleClickSession}
				/>
			</div>

			{
				selectedData.placeModal == true && <Modal
					overlay={overlay}
					hallInfo={hallInfo}
					currentDbPlaces={visiblePlaces || undefined}
					currentArrPlaces={currentArrPlaces}
					setCurrentArrPlaces={setCurrentArrPlaces}
					handleCloseModal={handleCloseModal}
					serialNumber={reservation.hall}
					units={reservation.units}
					className={reservation.placeModal ? 'display-none' : 'display-block'} reservation={reservation} />
			}
		</div >
	)
}

export default App

`
	},
	{
		id: 2,
		name: 'constants.js',
		language: 'js',
		content: `export const DAY_MILSEC = 24 * 60 * 60 * 1000
export const DAYS = ["Вск", "Пон", "Вт", "Сред", "Чтв", "Пят", "Суб"]
export const MONTH = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
export const TODAY = new Date().getTime()
export const YESTERDAY = new Date().getTime() - DAY_MILSEC
const curr = new Date(TODAY)
const d = curr.getDate()
const m = MONTH[curr.getMonth()]
const y = curr.getFullYear()
export const CURRENT_DATE = { d, m, y }
export const MAX_OBJECT_DATES = 7
export const CURRENT_OBJECT = 1

export const INITIAL_SELECTED = {
	film: false,
	hall: false,
	date: false,
	hour: false,
	place: false,
	placeModal: false
}
	export const INITIAL_RESERVATION = {
	film: '',
	hall: null,
	units: null,
	date: '',
	day: null,
	time: '',
	hour: null,
	places: []
}

export const INFO = 'Выберите, пожалуйста, фильм'
export const INFO_PAST = 'За прошедшие даты можно только посмотреть заполненность зала. Выберите фильм, сеанс и зал'
export const INFO_MODAL = 'РЕДАКТИРОВАТЬ ЗАПОЛНЕННОСТЬ ЗАЛА НЕЛЬЗЯ'

export const HALL_INFO = "В этом зале нет сеансов на этот фильм"

export const ACTIVE_CLASS = 'bg-orange cursor-pointer text-white'
export const FUTURE_CLASS = 'bg-night cursor-pointer text-silver-100'
export const PAST_CLASS = 'bg-black text-white cursor-pointer'
	
`
	},
	{
		id: 3,
		name: 'initialFunctionsMovieTheaters.js',
		language: 'javascript',
		content: `import { CITIES_DB } from '../constants/cinemaСhain/cities/citiesConstants.js'

export const DATA = JSON.parse(localStorage.getItem('CITIES_DB')) ?? CITIES_DB

if (!localStorage.getItem('CITIES_DB')) {
	localStorage.setItem("CITIES_DB", JSON.stringify(CITIES_DB))
}

// ДАННЫЕ ПО КИНОТЕАТРАМ ГОРОДА, ОТСЮДА ПОЛУЧАЕМ КИНОТЕАТРЫ
const cityTheaters = (db, data) => db.filter(el => el.city == data)[0]

// ДАННЫЕ ПО ЗАЛАМ КАЖДОГО КИНОТЕАТРА ГОРОДА
const dataFilmsCurrentHall = (db, data) => db.filter(el => el.city == data)[0].data_base

//  ДАННЫЕ ПО КАЖДОМУ ЗАЛУ КОНКРЕТНОГО КИНОТЕАТРА
const dataHallsCurrentTheatre = (data, o) => data.filter((el) => el.movieTheaters == o)[0].halls

const theatreCinema = (data, currentCinema) => data.filter(el => el.movieTheaters == currentCinema)[0]

export const arrayCity = (iCity, iCinema, CITIES_DB) => {
	// console.log('%cDATA', 'color: purple', iCity, iCinema, CITIES_DB, 'iCity, iCinema, CITIES_DB')
	const c = CITIES_DB[iCity].city
	// массив названий кинотеатров города - для dropdown
	const theatre = cityTheaters(CITIES_DB, c).cinema
	// теккущий кинотеатр	
	const currentTheatre = cityTheaters(CITIES_DB, c).cinema[iCinema]
	// данные по каждому кинотеатру текущего города
	const theaters = dataFilmsCurrentHall(CITIES_DB, c)
	// данные по каждому залу текущего кинотеатра
	const h = dataHallsCurrentTheatre(theaters, currentTheatre)
	const f = theatreCinema(theaters, currentTheatre)

	return { c, theatre, currentTheatre, theaters, h, f }
}
const { c, theatre, currentTheatre, h, f } = arrayCity(0, 0, DATA)
export const INITIAL_DATA = {
	city: c,
	dataTheatre: f,
	cinema: currentTheatre,
	cinemaList: theatre,
	halls: h
}

//  СЧЕТЧИК ЗАЛОВ, В КОТОРЫХ ИДЕТ ВЫБРАННЫЙ ФИЛЬМ
export const counterHalls = (elements, item) => {
  const counter = elements
    .map((el, i) => el.includes(item) ? i + 1 : null)
    .filter(index => index !== null)

  return counter.length === elements.length ? [999] : counter
}`
	},
	{
		id: 4,
		name: 'dataPeterburg.js',
		language: 'javascript',
		content: `
			import { PETERBURG_MOVIE_THEATERS } from "../constants/cinemaСhain/cities/peterburgConstants/peterburgConstants"
import { movieTheaters } from "../constants/cinemaСhain/functions"

export const dbPeterburg = movieTheaters(PETERBURG_MOVIE_THEATERS)`
	},
	{
		id: 5,
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