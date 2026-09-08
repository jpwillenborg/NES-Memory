using IGDB.Models;

namespace NES_Box_Art.Models;

public class TimelineGameViewModel
{
    // The core game data from the IGDB API
    public Game IgdbData { get; set; } = null!;

    // Custom hardware metrics for the data visualization
    public int SizeInKb { get; set; }
    public string MapperChip { get; set; } = "NROM"; // Default standard NES chip
    public string ReleaseYear { get; set; } = "Unknown";
    
    // Helper property to calculate relative visual weight on the UI
    public int VisualPercentage => Math.Min(100, Math.Max(10, (SizeInKb * 100) / 768));
}
