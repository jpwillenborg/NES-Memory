using IGDB;

var builder = WebApplication.CreateBuilder(args);

// 1. EXTRACT VARIABLES FROM THE LOCAL SECRETS REGISTER
var clientId = builder.Configuration["Twitch:ClientId"] ?? builder.Configuration["IGDB:ClientId"];
var clientSecret = builder.Configuration["Twitch:ClientSecret"] ?? builder.Configuration["IGDB:ClientSecret"];

// 2. REGISTER THE DI CONTROLLER INSTANCE WITH SAFE CONFIGURATION VALIDATION
builder.Services.AddSingleton<IGDBClient>(sp => 
{
    if (string.IsNullOrEmpty(clientId) || string.IsNullOrEmpty(clientSecret))
    {
        // Fallback placeholder instance preventing application breakdown on startup
        return new IGDBClient(string.Empty, string.Empty);
    }
    return new IGDBClient(clientId, clientSecret);
});

// Add standard framework MVC page support services
builder.Services.AddControllersWithViews();

var app = builder.Build();

// 3. CONFIGURE THE HTTP REQUEST PIPELINE ROUTER MAPPINGS
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
    app.UseHttpsRedirection();
}

app.UseStaticFiles();
app.UseRouting();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
