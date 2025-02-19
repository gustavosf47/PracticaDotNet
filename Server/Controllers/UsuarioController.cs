using Microsoft.AspNetCore.Mvc;
using MiApi.Models; // Importamos el contexto de la BD
using System.Collections.Generic;
using System.Linq;

namespace MiApi.Controllers
{
    // Define la ruta base del controlador como "/api/usuarios"
    [Route("api/[controller]")]
    [ApiController] // Especifica que este controlador es una API
    public class UsuariosController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        // Inyección de dependencias: Se recibe el contexto de la BD
        public UsuariosController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ==================== GET TODOS LOS USUARIOS ====================
        // GET: api/usuarios
        [HttpGet]
        public ActionResult<IEnumerable<Usuario>> GetUsuarios()
        {
            return _context.Usuarios.ToList(); // Devuelve todos los usuarios
        }

        // ==================== GET UN USUARIO POR ID ====================
        // GET: api/usuarios/5
        [HttpGet("{id}")] // Se usa "{id}" para que sea dinámico
        public ActionResult<Usuario> GetUsuario(int id)
        {
            var usuario = _context.Usuarios.Find(id); // Busca el usuario por ID
            if (usuario == null)
                return NotFound(); // Retorna 404 si no lo encuentra

            return usuario;
        }

        // ==================== CREAR UN NUEVO USUARIO ====================
        // POST: api/usuarios
        [HttpPost]
        public ActionResult<Usuario> PostUsuario(Usuario usuario)
        {
            _context.Usuarios.Add(usuario); // Agrega el usuario a la BD
            _context.SaveChanges(); // Guarda cambios en la BD

            // Devuelve el usuario creado con el código 201 Created
            return CreatedAtAction(nameof(GetUsuario), new { id = usuario.Id }, usuario);
        }

        // ==================== ACTUALIZAR UN USUARIO ====================
        // PUT: api/usuarios/5
        [HttpPut("{id}")]
        public IActionResult PutUsuario(int id, Usuario usuario)
        {
            if (id != usuario.Id)
                return BadRequest(); // Retorna 400 si los IDs no coinciden

            _context.Entry(usuario).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
            _context.SaveChanges(); // Guarda cambios en la BD

            return NoContent(); // Retorna 204 (sin contenido)
        }

        // ==================== ELIMINAR UN USUARIO ====================
        // DELETE: api/usuarios/5
        [HttpDelete("{id}")]
        public IActionResult DeleteUsuario(int id)
        {
            var usuario = _context.Usuarios.Find(id); // Busca el usuario
            if (usuario == null)
                return NotFound(); // Retorna 404 si no lo encuentra

            _context.Usuarios.Remove(usuario); // Elimina el usuario
            _context.SaveChanges(); // Guarda cambios en la BD

            return NoContent(); // Retorna 204 (sin contenido)
        }
    }
}
