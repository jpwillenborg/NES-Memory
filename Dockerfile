# Stage 1: Build the application using the .NET SDK
FROM ://microsoft.com AS build
WORKDIR /src

# Copy the csproj file and restore dependencies
COPY *.csproj ./
RUN dotnet restore

# Copy the rest of the project files and build
COPY . ./
RUN dotnet publish -c Release -o /app/publish

# Stage 2: Run the application using the runtime image
FROM ://microsoft.com AS final
WORKDIR /app
COPY --from=build /app/publish .

# Render assigns a dynamic port; ASP.NET Core must listen to all IPs on that port
ENV ASPNETCORE_URLS=http://+:10000
EXPOSE 10000

ENTRYPOINT ["dotnet", "NES Box Art.dll"]a
