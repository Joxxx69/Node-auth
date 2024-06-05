import { userModel } from "../../data/mongodb";
import { AuthDataSource, CustomError, RegisterUserDto, UserEntity } from "../../domain";


export class AuthDataSourceImpl implements AuthDataSource{

    async register(registerUserDto: RegisterUserDto): Promise<UserEntity> {
        const {name,email,password} = registerUserDto;
        try {

            // 1. Verificar si el correo existe
            const exists = await userModel.findOne({email})
            if (exists) throw CustomError.badRequest('User already exist');

            const user = await userModel.create({
                name,
                email,
                password
            })
            await user.save();


            const userNew = new userModel({
                name,
                email,
                password,
                roles: ['ADMIN_ROLE']
            });

            userNew.save();



            // 2. Hash de la contrasena

            // 3. Mapear la respuesta a nuestra entidad
            return new UserEntity(
                '1',
                name,
                email,
                password,
                ['ADMIN_ROLE']
            )
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError();
        }
    }


}