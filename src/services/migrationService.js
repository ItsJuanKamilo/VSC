import { supabase } from '../config/supabase';
import bcrypt from 'bcryptjs';

export const migrationService = {
  // Migrar contraseñas existentes a formato encriptado
  async migratePasswords() {
    try {
      console.log('🔄 Iniciando migración de contraseñas...');
      
      // Obtener todos los usuarios con contraseñas sin encriptar
      const { data: users, error } = await supabase
        .from('users')
        .select('id, email, password_hash')
        .neq('password_hash', '');

      if (error) {
        console.error('❌ Error obteniendo usuarios:', error);
        return { success: false, error: error.message };
      }

      console.log(`📊 Encontrados ${users.length} usuarios para migrar`);

      // Encriptar cada contraseña
      for (const user of users) {
        try {
          // Verificar si ya está encriptada (bcrypt genera hashes de 60 caracteres)
          if (user.password_hash.length === 60 && user.password_hash.startsWith('$2')) {
            console.log(`⏭️  Usuario ${user.email} ya tiene contraseña encriptada`);
            continue;
          }

          // Encriptar la contraseña
          const saltRounds = 10;
          const hashedPassword = await bcrypt.hash(user.password_hash, saltRounds);

          // Actualizar en la base de datos
          const { error: updateError } = await supabase
            .from('users')
            .update({ password_hash: hashedPassword })
            .eq('id', user.id);

          if (updateError) {
            console.error(`❌ Error actualizando usuario ${user.email}:`, updateError);
          } else {
            console.log(`✅ Usuario ${user.email} migrado exitosamente`);
          }
        } catch (userError) {
          console.error(`❌ Error procesando usuario ${user.email}:`, userError);
        }
      }

      console.log('✅ Migración de contraseñas completada');
      return { success: true };
    } catch (error) {
      console.error('❌ Error en migración:', error);
      return { success: false, error: error.message };
    }
  },

  // Verificar estado de encriptación
  async checkEncryptionStatus() {
    try {
      const { data: users, error } = await supabase
        .from('users')
        .select('email, password_hash');

      if (error) {
        console.error('❌ Error verificando usuarios:', error);
        return { success: false, error: error.message };
      }

      const encrypted = users.filter(u => u.password_hash.length === 60 && u.password_hash.startsWith('$2'));
      const unencrypted = users.filter(u => !(u.password_hash.length === 60 && u.password_hash.startsWith('$2')));

      console.log(`📊 Estado de encriptación:`);
      console.log(`   ✅ Encriptadas: ${encrypted.length}`);
      console.log(`   ❌ Sin encriptar: ${unencrypted.length}`);

      return {
        success: true,
        encrypted: encrypted.length,
        unencrypted: unencrypted.length,
        total: users.length
      };
    } catch (error) {
      console.error('❌ Error verificando estado:', error);
      return { success: false, error: error.message };
    }
  }
}; 