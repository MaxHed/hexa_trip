const { StatusCodes } = require('http-status-codes');
const User = require('../models/User');

// user routes
const getProfile = async (req, res) => {
    try {
        const middlewareUser = req.user;
        return res.status(StatusCodes.OK).send({ middlewareUser });
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Error while getting profile' });
    }
}

const updateProfile = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(StatusCodes.BAD_REQUEST).send({ message: 'User ID is required' });
        }
        const data = req.body;
        const user = await User.findByIdAndUpdate(id, data, { new: true }).select('-password -__v');
        return res.status(StatusCodes.OK).send({ user });
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Error while updating profile, message: ' + error.message });
    }
}

const deleteProfile = async (req, res) => {
    try {
        const middlewareUser = req.user;
        await User.findByIdAndDelete(middlewareUser._id);

        // /!\ ici je suis le tuto, mais il me semble qu'une commande est une piece comptable, donc je ne peux pas la supprimer 
        // De plus, la suppression se fait via l'email, donc si l'utilisateur à changé d'email, la suppression ne fonctionnera pas sur toutes ses commandes BAD PRACTICE !!!!
        await Order.deleteMany({ email: middlewareUser.email }); // BAD PRACTICE !!!!


        return res.status(StatusCodes.OK).send({ message: 'User deleted successfully' });
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Error while deleting profile, message: ' + error.message });
    }
}
module.exports = { getProfile, updateProfile, deleteProfile };