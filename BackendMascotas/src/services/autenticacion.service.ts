import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Llaves} from '../config/llaves';
import {Usuario} from '../models';
import {UsuarioRepository} from '../repositories';
const generador = require('password-generator');
const cryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');

@injectable({scope: BindingScope.TRANSIENT})
export class AutenticacionService {
  constructor(
    @repository(UsuarioRepository)
    public usuarioRepository: UsuarioRepository
  ) { }

  /*
   * Add service methods here
   */

  // Generar contraseña
  GenerarContrasena() {
    let contrasena = generador(8, false);
    return contrasena;
  }

  // Cifrar la contrasena
  CifrarContrasena(contrasena: string) {
    let contrasenaCifrada = cryptoJS.MD5(contrasena).toString();
    return contrasenaCifrada;
  }

  // Identificar al usuario
  IdentificarUsuario(usuario: string, contrasena: string) {
    try {
      let u = this.usuarioRepository.findOne({where: {correo: usuario, contrasena: contrasena}});
      if (u) {
        return u
      }
      return false;
    } catch {
      return false;
    }
  }

  // Generar token a un usuario
  GenerarTokenJWT(usuario: Usuario) {
    let token = jwt.sign({
      data: {
        id: usuario.id,
        cedula: usuario.cedula,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        telefono: usuario.telefono,
        correo: usuario.correo,
        contrasena: usuario.contrasena,
        rol: usuario.rol
      }
    },
      Llaves.claveJWT);
    return token;
  }

  // validar el token generado
  ValidarTokenJWT(token: string) {
    try {
      let datos = jwt.verify(token, Llaves.claveJWT);
      return datos;

    } catch {
      return false;
    }
  }


}
