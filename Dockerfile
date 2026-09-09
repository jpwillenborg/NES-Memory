# Use the official Microsoft .NET SDK image to build the app
FROM ://microsoft.com AS build-env
WORKDIR /app

# Copy project files and restore dependencies
COPY *.csproj ./
RUN dotnet restore

# Copy the rest of the code and publish a Release build
COPY . ./
RUN dotnet publish -c Release -o out

# Build the final runtime image using the lightweight .NET runtime
FROM ://microsoft.com
WORKDIR /app
COPY --from=build-env /app/out .

# Tell Docker to run your app executable
ENTRYPOINT ["dotnet", "NES_Box_Art.dll"]