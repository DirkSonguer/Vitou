Input: direction, angle, power

// check if player turret allows shot (angle)
if (Player.CurrentWeaponTurretEntity.CanFireComponent.maxAngle < Input.angle) {
	return ERROR;
}

// check if player turret allows shot (power)
if (Player.CurrentWeaponTurretEntity.CanFireComponent.maxPower < Input.power) {
	return ERROR;
}

// calculate impact position
impactPosition = ..

impactedPlayerEntities = GetAllPlayersAffectedByShot(impactPosition);

foreach (impactedPlayerEntities as impactedPlayerEntity) {
	// check if opponent is destroyed
	if (impactedPlayerEntity.CurrentTankEntity.HitpointComponent.hitpoints < Player.CurrentWeaponTurretEntity.CanFireComponent.damage)
	{
		// current player has won
		..
	}
	
	// send message to other player with impact
	queueMessage(HIT_BY_WEAPON, impactedPlayerEntity, Player.CurrentWeaponTurretEntity);
	return OK;
}

