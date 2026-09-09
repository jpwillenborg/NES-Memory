using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using IGDB;
using NES_Box_Art.Models;

namespace NES_Box_Art.Controllers
{
    public class HomeController : Controller
    {
        private readonly IConfiguration _config;

        public HomeController(IConfiguration config)
        {
            _config = config;
        }

        [HttpGet("Grid")]
        public async Task<IActionResult> Grid()
        {
            var gameList = new[] { 
                "Super Mario Bros.", "Castlevania", "The Legend of Zelda", "Contra", "Metroid",
                "Rad Racer", "Mike Tyson's Punch-Out!!", "Ninja Gaiden", "Excitebike",
                "Zelda II: The Adventure of Link", "Final Fantasy", "Tetris", "Mega Man",
                "Mega Man 2", "Mega Man 3", "Blaster Master", "Kirby's Adventure", "StarTropics",
                "Dragon Warrior", "Faxanadu", "R.C. Pro-Am", "Tecmo Bowl", "Life Force",
                "Double Dragon", "Kid Icarus", "Ice Hockey", "Rygar", "Ghosts 'n Goblins"
            };

            var clientId = _config["Twitch:ClientId"] ?? _config["IGDB:ClientId"];
            var clientSecret = _config["Twitch:ClientSecret"] ?? _config["IGDB:ClientSecret"];

            if (string.IsNullOrEmpty(clientId) || string.IsNullOrEmpty(clientSecret))
            {
                ViewBag.Error = "SECRETS READING DEFICIENCY: The configuration engine cannot find your ClientId or ClientSecret from your user-secrets storage vault.";
                return View(new List<TimelineGameViewModel>());
            }

            var localIgdbClient = new IGDBClient(clientId, clientSecret);
            string gameNamesQuery = string.Join(", ", gameList.Select(name => $"\"{name}\""));
            
            // EXTENDED API QUERY: Explicitly pulls deep release date properties for month/day parsing
            string query = "fields name, cover.*, first_release_date, release_dates.*; " +
                           $"where name = ({gameNamesQuery}) & platforms = (18) & cover != null; " +
                           "limit 50;";
                        try
            {
                var igdbGames = await localIgdbClient.QueryAsync<IGDB.Models.Game>(IGDBClient.Endpoints.Games, query);
                var processedGames = igdbGames.ToList();

                var tetrisVariants = processedGames.Where(g => g.Name?.Equals("Tetris", StringComparison.OrdinalIgnoreCase) == true).ToList();
                if (tetrisVariants.Count > 1)
                {
                    var officialBlueTetris = tetrisVariants.OrderByDescending(t => t.FirstReleaseDate).First();
                    processedGames.RemoveAll(g => g.Name?.Equals("Tetris", StringComparison.OrdinalIgnoreCase) == true);
                    processedGames.Add(officialBlueTetris);
                }

                var gridData = processedGames.Select(g => {
                    string gameName = g.Name ?? "";
                    
                    // Establish a standardized baseline DateTime object
                    DateTime targetDate = g.FirstReleaseDate.HasValue ? g.FirstReleaseDate.Value.UtcDateTime : new DateTime(1980, 1, 1);

                    // STRICT NORTH AMERICAN MONTH-BASED REGION FILTER
                    if (g.ReleaseDates?.Values != null && g.ReleaseDates.Values.Any())
                    {
                        // Target North American text indicators cleanly
                        var naRelease = g.ReleaseDates.Values.FirstOrDefault(r => 
                            r.Human != null && (
                                r.Human.Contains("North America", StringComparison.OrdinalIgnoreCase) || 
                                r.Human.Contains("USA", StringComparison.OrdinalIgnoreCase)
                            )
                        );

                        if (naRelease != null && naRelease.Date.HasValue)
                        {
                            targetDate = naRelease.Date.Value.UtcDateTime;
                        }
                    }

                                        // TIMELINE CORRECTIONS (Locks both onto October 18, 1985 US Launch)
                    if (gameName.Equals("Excitebike", StringComparison.OrdinalIgnoreCase) || 
                        gameName.Equals("Super Mario Bros.", StringComparison.OrdinalIgnoreCase))
                    {
                        targetDate = new DateTime(1985, 10, 18);
                    }

                    // FIXED: Formats to upper case "MMM yyyy" (e.g. "OCT 1985").
                    // Keeps the invisible prefix code ("1985-10") first so chronological sorting stays 100% accurate!
                    string preciseDateString = targetDate.ToString("yyyy-MM") + "|" + targetDate.ToString("MMM yyyy").ToUpper();

                    int sizeKb = 32; string chip = "NROM";
                    if (gameName.Equals("Super Mario Bros.", StringComparison.OrdinalIgnoreCase)) { sizeKb = 40; chip = "NROM"; }
                    else if (gameName.Contains("Castlevania", StringComparison.OrdinalIgnoreCase)) { sizeKb = 128; chip = "UNROM"; }
                    else if (gameName.Contains("Legend of Zelda", StringComparison.OrdinalIgnoreCase) && !gameName.Contains("Zelda II", StringComparison.OrdinalIgnoreCase)) { sizeKb = 128; chip = "MMC1"; }
                    else if (gameName.Contains("Contra", StringComparison.OrdinalIgnoreCase)) { sizeKb = 128; chip = "UNROM"; }
                    else if (gameName.Contains("Metroid", StringComparison.OrdinalIgnoreCase)) { sizeKb = 128; chip = "MMC1"; }
                    else if (gameName.Contains("Rad Racer", StringComparison.OrdinalIgnoreCase)) { sizeKb = 128; chip = "CNROM"; }
                    else if (gameName.Contains("Punch-Out", StringComparison.OrdinalIgnoreCase)) { sizeKb = 256; chip = "MMC2"; }
                    else if (gameName.Contains("Ninja Gaiden", StringComparison.OrdinalIgnoreCase)) { sizeKb = 256; chip = "MMC1"; }
                    else if (gameName.Contains("Excitebike", StringComparison.OrdinalIgnoreCase)) { sizeKb = 24; chip = "NROM"; }
                    else if (gameName.Contains("Zelda II", StringComparison.OrdinalIgnoreCase)) { sizeKb = 256; chip = "MMC1"; }
                    else if (gameName.Contains("Final Fantasy", StringComparison.OrdinalIgnoreCase)) { sizeKb = 256; chip = "MMC1"; }
                    else if (gameName.Equals("Tetris", StringComparison.OrdinalIgnoreCase)) { sizeKb = 48; chip = "NROM"; }
                    else if (gameName.Equals("Mega Man", StringComparison.OrdinalIgnoreCase)) { sizeKb = 128; chip = "UNROM"; }
                    else if (gameName.Contains("Mega Man 2", StringComparison.OrdinalIgnoreCase)) { sizeKb = 256; chip = "MMC1"; }
                    else if (gameName.Contains("Mega Man 3", StringComparison.OrdinalIgnoreCase)) { sizeKb = 384; chip = "MMC3"; }
                    else if (gameName.Contains("Blaster Master", StringComparison.OrdinalIgnoreCase)) { sizeKb = 256; chip = "MMC1"; }
                    else if (gameName.Contains("Kirby's Adventure", StringComparison.OrdinalIgnoreCase)) { sizeKb = 768; chip = "MMC5"; }
                    else if (gameName.Contains("StarTropics", StringComparison.OrdinalIgnoreCase)) { sizeKb = 512; chip = "MMC6"; }
                    else if (gameName.Contains("Dragon Warrior", StringComparison.OrdinalIgnoreCase)) { sizeKb = 64; chip = "MMC1"; }
                    else if (gameName.Contains("Faxanadu", StringComparison.OrdinalIgnoreCase)) { sizeKb = 256; chip = "MMC1"; }
                    else if (gameName.Contains("Pro-Am", StringComparison.OrdinalIgnoreCase)) { sizeKb = 64; chip = "SEROM"; } 
                    else if (gameName.Contains("Tecmo Bowl", StringComparison.OrdinalIgnoreCase)) { sizeKb = 192; chip = "MMC1"; }
                    else if (gameName.Contains("Life Force", StringComparison.OrdinalIgnoreCase)) { sizeKb = 128; chip = "UNROM"; }
                    else if (gameName.Contains("Double Dragon", StringComparison.OrdinalIgnoreCase)) { sizeKb = 256; chip = "MMC1"; }
                    else if (gameName.Contains("Kid Icarus", StringComparison.OrdinalIgnoreCase)) { sizeKb = 128; chip = "MMC1"; }
                    else if (gameName.Contains("Ice Hockey", StringComparison.OrdinalIgnoreCase)) { sizeKb = 48; chip = "NROM"; }
                    else if (gameName.Contains("Rygar", StringComparison.OrdinalIgnoreCase)) { sizeKb = 128; chip = "UNROM"; }
                    else if (gameName.Contains("Ghosts 'n Goblins", StringComparison.OrdinalIgnoreCase)) { sizeKb = 128; chip = "CNROM"; }

                    return new TimelineGameViewModel {
                        IgdbData = g, SizeInKb = sizeKb, MapperChip = chip, ReleaseYear = preciseDateString
                    };
                })
                .OrderBy(x => x.ReleaseYear)
                .ToList();

                return View(gridData);
            }

            catch (Exception ex)
            {
                ViewBag.Error = $"DATABASE ACCESS EXCEPTION DETECTED: {ex.Message}";
                return View(new List<TimelineGameViewModel>());
            }


        }
    }
}
