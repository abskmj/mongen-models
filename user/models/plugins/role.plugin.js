const mongoose = require('mongoose');

module.exports = (schema, options) => {
    
    schema.add({ roles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }] });
    
    schema.methods.hasRole = async function(roleName){
        // get role instance for passed role slug
        let role = await this.model('Role').findOne({ slug: roleName });
        
        if(role){
            // loop through roles array and check for passed role
            return this.roles.some((roleId) => {
                if(role.equals(roleId)){
                    return true;
                }
            });
        }
        else{
            throw new Error('Role instance not found: '+roleName);
        }
    };

};
