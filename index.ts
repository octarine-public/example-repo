import {
	Color,
	EventsSDK,
	GUIInfo,
	LocalPlayer,
	Menu,
	naga_siren_mirror_image,
	npc_dota_hero_naga_siren,
	Rectangle,
	RendererSDK,
	TextFlags,
	Vector2
} from "github.com/octarine-public/wrapper/index"

new (class ExampleScript {
	// Menu
	private readonly entry = Menu.AddEntry("Example")

	// — Ability section
	private readonly abilityTree = this.entry.AddNode("Naga Siren")
	private readonly castKey = this.abilityTree.AddKeybind("Cast Mirror Image", "None", "Press to cast Mirror Image")

	// — Drawing section
	private readonly drawTree = this.entry.AddNode("2D Square Demo")
	private readonly drawState = this.drawTree.AddToggle("State", true)
	private readonly size = this.drawTree.AddSlider("Square Size", 150, 50, 500)
	private readonly rotation = this.drawTree.AddSlider("Rotation", 0, 0, 360)
	private readonly opacity = this.drawTree.AddSlider("Opacity", 180, 0, 255)
	private readonly borderWidth = this.drawTree.AddSlider("Border Width", 2, 0, 10)
	private readonly fillColor = this.drawTree.AddColorPicker("Fill Color", new Color(50, 150, 255))
	private readonly borderColor = this.drawTree.AddColorPicker("Border Color", new Color(255, 255, 255))
	private readonly showText = this.drawTree.AddToggle("Show Info Text", true)

	constructor() {
		this.castKey.OnPressed(() => this.CastFirstSpell())
		EventsSDK.on("Draw", this.Draw.bind(this))
		EventsSDK.on("GameEnded", this.GameEnded.bind(this))
	}

	// — Ability logic
	private CastFirstSpell(): void {
		const hero = LocalPlayer?.Hero
		if (hero === undefined || !(hero instanceof npc_dota_hero_naga_siren)) {
			return
		}
		const ability = hero.Spells.find(spell => spell instanceof naga_siren_mirror_image)
		if (ability === undefined || !ability.CanBeCasted()) {
			return
		}
		hero.CastNoTarget(ability, false, true)
	}

	// — Drawing logic
	private Draw(): void {
		if (!this.drawState.value) {
			return
		}

		const screenW = RendererSDK.WindowSize.x
		const screenH = RendererSDK.WindowSize.y
		const squareSize = GUIInfo.ScaleHeight(this.size.value)
		const fill = this.fillColor.SelectedColor.SetA(this.opacity.value)

		const pos = new Vector2((screenW - squareSize) / 2, (screenH - squareSize) / 2)
		const vecSize = new Vector2(squareSize, squareSize)

		RendererSDK.FilledRect(pos, vecSize, fill, this.rotation.value)

		if (this.borderWidth.value > 0) {
			RendererSDK.OutlinedRect(
				pos,
				vecSize,
				this.borderWidth.value,
				this.borderColor.SelectedColor,
				this.rotation.value
			)
		}

		if (this.showText.value) {
			const textRect = new Rectangle()
			const textY = pos.y + squareSize + GUIInfo.ScaleHeight(10)
			textRect.pos1.CopyFrom(new Vector2(pos.x, textY))
			textRect.pos2.CopyFrom(new Vector2(pos.x + squareSize, textY + GUIInfo.ScaleHeight(30)))
			RendererSDK.TextByFlags(
				`Size: ${this.size.value} | Rotation: ${this.rotation.value}`,
				textRect,
				Color.White,
				1.2,
				TextFlags.Center
			)
		}
	}

	private GameEnded(): void {
		this.castKey.isPressed = false
	}
})()
