import { Menu } from "github.com/octarine-public/wrapper/index";

const armletMenu = Menu.AddEntry("Armlet");

// Добавляем чекбокс (по умолчанию выключен)
const alwaysOn = armletMenu.AddToggle("Армлет всегда включён", false);

