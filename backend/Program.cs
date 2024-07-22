var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors();

var app = builder.Build();

app.UseCors(policy => policy
    .AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader()
);

var items = new List<Item>
{
    new Item { Id = 1, Symbol = "BTC", Name = "Bitcoin", Description = "The first cryptocurrency", Price = 30000 },
    new Item { Id = 2, Symbol = "ETH", Name = "Ethereum", Description = "A decentralized platform", Price = 2000 }
};

app.MapGet("/", () => "Table with CRUD methods for different crypto prices");

app.MapGet("/api/items", () => items);

app.MapGet("/api/items/{id}", (int id) =>
{
    var item = items.FirstOrDefault(i => i.Id == id);
    return item is not null ? Results.Ok(item) : Results.NotFound();
});

app.MapPost("/api/items", (Item newItem) =>
{
    newItem.Id = items.Count + 1;
    items.Add(newItem);
    return Results.Created($"/api/items/{newItem.Id}", newItem);
});

app.MapPut("/api/items/{id}", (int id, Item updatedItem) =>
{
    var item = items.FirstOrDefault(i => i.Id == id);
    if (item is null) return Results.NotFound();

    item.Symbol = updatedItem.Symbol;
    item.Name = updatedItem.Name;
    item.Description = updatedItem.Description;
    item.Price = updatedItem.Price;
    return Results.NoContent();
});

app.MapDelete("/api/items/{id}", (int id) =>
{
    var item = items.FirstOrDefault(i => i.Id == id);
    if (item is null) return Results.NotFound();

    items.Remove(item);
    return Results.NoContent();
});

app.Run();

public class Item
{
    public int Id { get; set; }
    public string? Symbol { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
    public decimal Price { get; set; }
}
