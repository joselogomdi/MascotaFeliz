import {AuthenticationStrategy} from '@loopback/authentication';
import {service} from '@loopback/core/dist/service';
import {HttpErrors, Request} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import parseBearerToken from 'parse-bearer-token';
import {AutenticacionService} from '../services';

export class EstrategiaAdministrador implements AuthenticationStrategy {
  name: string = 'Administrador';

  constructor(
    @service(AutenticacionService)
    public servicioAutenticacion: AutenticacionService
  ) { }

  async authenticate(request: Request): Promise<UserProfile | undefined> {
    let token = parseBearerToken(request);
    if (token) {
        let datos = this.servicioAutenticacion.ValidarTokenJWT(token)

        // hacer validaciones dependiendo de cada rol
        //if (datos.data.rol == 'admin')

            if (datos) {
              let perfil: UserProfile = Object.assign({
                nombre: datos.data.nombre
              });
              return perfil;

            } else {
              throw new HttpErrors[401]('El token estaba malo')
              }

    } else {
      throw new HttpErrors[401]('No se incluyó token')
      }

  }
}
