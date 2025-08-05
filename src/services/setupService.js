import { supabase } from '../config/supabase';

export const setupService = {
  // Verificar conexión y estado de la base de datos
  async checkDatabaseStatus() {
    try {
      console.log('🔧 Verificando estado de la base de datos...');
      
      // Verificar que podemos acceder a las tablas
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('count')
        .limit(1);
      
      if (usersError) {
        console.error('❌ Error accediendo a tabla users:', usersError);
        return { success: false, error: 'No se puede acceder a la tabla users' };
      }
      
      const { data: deliveries, error: deliveriesError } = await supabase
        .from('deliveries')
        .select('count')
        .limit(1);
      
      if (deliveriesError) {
        console.error('❌ Error accediendo a tabla deliveries:', deliveriesError);
        return { success: false, error: 'No se puede acceder a la tabla deliveries' };
      }
      
      console.log('✅ Base de datos accesible');
      return { success: true };
    } catch (error) {
      console.error('❌ Error verificando base de datos:', error);
      return { success: false, error: error.message };
    }
  },

  // Configuración completa de la base de datos
  async setupDatabase() {
    try {
      console.log('🚀 Verificando base de datos...');
      
      // Solo verificar conexión
      const result = await this.checkDatabaseStatus();
      
      if (result.success) {
        console.log('✅ Base de datos verificada correctamente');
      } else {
        console.log('⚠️ Problemas con la base de datos:', result.error);
      }
      
      return result;
    } catch (error) {
      console.error('❌ Error configurando base de datos:', error);
      return { success: false, error: error.message };
    }
  }
}; 