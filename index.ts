import {
	BitsExtensions,
	Color,
	ConVarsSDK,
	DOTAGameState,
	DOTAGameUIState,
	EventsSDK,
	ExecuteOrder,
	GameRules,
	GameSleeper,
	GameState,
	GetPositionHeight,
	GridNav,
	GridNavCellFlags,
	GUIInfo,
	Input,
	LocalPlayer,
	Menu,
	ParticlesSDK,
	PlayerCustomData,
	ProjectileManager,
	Rectangle,
	RendererSDK,
	Team,
	Utils,
	Vector2,
	Vector3,
	WorldPolygon,
} from "github.com/octarine-public/wrapper/index"

let armletActive = false

const armletHpSlider = Menu.AddSlider("Armlet HP Threshold", 500, 50, 1500)

// Включить армлет
function armletOn() {
	if (LocalPlayer?.Hero === undefined) return
	const armletItem = LocalPlayer.Hero.Inventory.FindItemByName("item_armlet")
	if (armletItem === undefined) return
	if (!armletActive) {
		ExecuteOrder.PrepareOrder({
			orderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET,
			ability: armletItem,
			unit: LocalPlayer.Hero,
		})
		armletActive = true
	}
}

// Выключить армлет
function armletOff() {
	if (LocalPlayer?.Hero === undefined) return
	const armletItem = LocalPlayer.Hero.Inventory.FindItemByName("item_armlet")
	if (armletItem === undefined) return
	if (armletActive) {
		ExecuteOrder.PrepareOrder({
			orderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET,
			ability: armletItem,
			unit: LocalPlayer.Hero,
		})
		armletActive = false
	}
}

// --- Калбеке ---
EventsSDK.on("PostDataUpdate", () => {
	if (LocalPlayer?.Hero === undefined) return
	const heroHp = LocalPlayer.Hero.HP

	const threshold = armletHpSlider.Value

	if (heroHp <= threshold && !armletActive) {
		armletOn()
	} else if (heroHp > threshold && armletActive) {
		armletOff()
	}
})
