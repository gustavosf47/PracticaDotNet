using Microsoft.EntityFrameworkCore;
using MiApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Configurar la conexión a MySQL
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString))
);

// Habilitar controladores y Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configuración de CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // Permite solo solicitudes desde este origen
              .AllowAnyMethod()  // Permite cualquier método (GET, POST, PUT, DELETE, etc.)
              .AllowAnyHeader(); // Permite cualquier encabezado
    });
});

var app = builder.Build();

// Habilitar Swagger para pruebas en desarrollo
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Habilitar CORS
app.UseCors("AllowLocalhost");

app.UseAuthorization();
app.MapControllers();
app.Run();
