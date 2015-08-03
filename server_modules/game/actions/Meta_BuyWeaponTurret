
Input: WeaponTurretEntity

// check if player has enough money
if (Player.HasMoneyComponent.bank > Input.WeaponTurretEntity.PriceComponent.price) {
	createEntity(Player, Input.WeaponTurretEntity);
	Player.HasMoneyComponent.bank =- Input.TankEntity.PriceComponent.price;
	return OK;
} else {
	return ERROR;
}