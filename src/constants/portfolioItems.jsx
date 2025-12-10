import { FaCheckCircle, FaComments, FaTicketAlt, FaSpa, FaHandSparkles  } from "react-icons/fa"
import { codeFiles } from "./dataMovieTickets"

export const portfolioItems = [	
	{
		id: 1,
		title: "Сайт-визитка мастера шугаринга",
		description: "Студия шугаринга с онлайн-записью, выбором услуги и времени.",
		icon: <FaHandSparkles />,
		tech: ["ReactJS", "Vite"],
		// link: "#",
		demo: "https://sugar-lux-site.vercel.app/"
	},
	{
		id: 2,
		title: "Билетная касса",
		description: "Система бронирования билетов с выбором мест, онлайн-оплатой и админ-панелью",
		icon: <FaTicketAlt />,
		tech: ["ReactJS", "TailwindCSS", "vite", "LocalStorage"],
		link: "#",
		demo: "https://natalia-vorobeva.github.io/movie-ticket-system/",
		code: codeFiles

	},
	{
		id: 3,
		title: "ToDo List",
		description: "Продуктивное приложение с категориями, тегами, дедлайнами и аналитикой",
		icon: <FaCheckCircle />,
		tech: ["ReactJS", "JWT", "Express", "Tailwindcss", "SQLite3"],
		link: "#",
		demo: "#"
	},
	{
		id: 4,
		title: "Мессенджер",
		description: "Чат-приложение в реальном времени с комнатами, файлами и видеозвонками",
		icon: <FaComments />,
		tech: ["ReactJS", "Node.js", "Vite", "PostgreSQL"],
		link: "#",
		demo: "#"
	}
]
