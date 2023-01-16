module.exports = class UserDTO {
	email;
	username;
	id;

	constructor(model) {
		this.email = model.email;
		this.username = model.username;
		this.id = model._id;
	}
};
