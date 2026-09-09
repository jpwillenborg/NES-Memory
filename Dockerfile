# Use the automated Docker mirror path directly to completely bypass Render's parser bug
FROM dotnet/sdk:10.0 AS build-env
WORKDIR /app

# Copy project files and restore dependencies explicitly
COPY ./*.csproj ./
RUN dotnet restore

# Copy the rest of the code and publish a Release build
COPY . ./
RUN dotnet publish -c Release -o out

# Grab the lightweight runtime container via the mirror hub path
FROM dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build-env /app/out .

# Run your app executable utilizing your exact project name with spaces
ENTRYPOINT ["dotnet", "NES Box Art.dll"]