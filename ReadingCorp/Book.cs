using System.ComponentModel.DataAnnotations;
public enum BookCategory
{
    Thriller,
    History,
    Drama,
    Biography
}

public class Book
{
    public int Id { get; set; }

    [Required]
    public string Name { get; set; }

    [Required]
    public string Author { get; set; }

    public string? RegistrationTimestamp { get; set; }

    [Required]
    [EnumDataType(typeof(BookCategory))]
    public string Category { get; set; }

    [Required]
    public string Description { get; set; }
}
