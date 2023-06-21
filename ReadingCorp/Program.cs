using Microsoft.EntityFrameworkCore;
using ReadingCorp;
using Azure.Identity;

var builder = WebApplication.CreateBuilder(args);

// Add Azure App Configuration to the container.
var azAppConfigConnection = builder.Configuration["AppConfig"];
if (!string.IsNullOrEmpty(azAppConfigConnection))
{
    // Use the connection string if it is available.
    builder.Configuration.AddAzureAppConfiguration(options =>
    {
        options.Connect(azAppConfigConnection)
        .ConfigureRefresh(refresh =>
        {
            // All configuration values will be refreshed if the sentinel key changes.
            refresh.Register("TestApp:Settings:Sentinel", refreshAll: true);
        });
    });
}
else if (Uri.TryCreate(builder.Configuration["Endpoints:AppConfig"], UriKind.Absolute, out var endpoint))
{
    // Use Azure Active Directory authentication.
    // The identity of this app should be assigned 'App Configuration Data Reader' or 'App Configuration Data Owner' role in App Configuration.
    // For more information, please visit https://aka.ms/vs/azure-app-configuration/concept-enable-rbac
    builder.Configuration.AddAzureAppConfiguration(options =>
    {
        options.Connect(endpoint, new DefaultAzureCredential())
        .ConfigureRefresh(refresh =>
        {
            // All configuration values will be refreshed if the sentinel key changes.
            refresh.Register("TestApp:Settings:Sentinel", refreshAll: true);
        });
    });
}
builder.Services.AddAzureAppConfiguration();

builder.Services.AddControllers();
builder.Services.AddDbContext<BookContext>(opt =>
    opt.UseInMemoryDatabase("BookList"));

// Add CORS services. https://learn.microsoft.com/en-us/aspnet/core/security/cors?view=aspnetcore-7.0
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseAzureAppConfiguration();

app.UseHttpsRedirection();


app.UseDefaultFiles(); 
app.UseStaticFiles();

app.UseCors();

app.UseAuthorization();

app.MapControllers();

app.Run();
