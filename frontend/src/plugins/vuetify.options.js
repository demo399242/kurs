
export default {
  icons: { values: require("~/components/global/icons/font-icons.json") },
  theme: {
		dark: JSON.parse(localStorage.nightMode || "false"),
		themes: {
			light: {
				primary: "#2D85DD",
				secondary: "#F5F6FA",
				accent: "#2E3FD1",
				info: "#009688",
				error: "#EB6559",
				warning: "#D18411",
				success: "#4CE252",
			},
			dark: {
				primary: "#111d23",
				secondary: "#283132",
				accent: "#5FA73D",
				info: "#039BE5",
				error: "#EB6559",
				warning: "#FFB74D",
				success: "#64DD17",
			},
		},
		options: {
			customProperties: true,
		},
	},
}
