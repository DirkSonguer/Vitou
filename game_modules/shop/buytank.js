
Input: TankEntity

// check if player has enough money
if (Player.HasMoneyComponent.bank > Input.TankEntity.PriceComponent.price) {
	createEntity(Player, Input.TankEntity);
	Player.HasMoneyComponent.bank =- Input.TankEntity.PriceComponent.price;
	return OK;
} else {
	return ERROR;
}