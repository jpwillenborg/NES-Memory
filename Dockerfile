# 1. SDK BUILD ENVIRONMENT STAGE
# Pulls official .NET 10.0 SDK container using its permanent system SHA digest identifier
FROM ://microsoft.com AS build-env
WORKDIR /app

# Copy project files and restore dependencies explicitly
COPY ./*.csproj ./
RUN dotnet restore

# Copy the rest of the code and publish a Release build
COPY . ./
RUN dotnet publish -c Release -o out

# 2. RUNTIME ENVIRONMENT STAGE
# Pulls official .NET 10.0 ASP.NET Runtime container using its permanent system SHA digest identifier
FROM ://microsoft.com
WORKDIR /app
COPY --from=build-env /app/out .

# Run your app executable utilizing your exact project name with spaces
ENTRYPOINT ["dotnet", "NES Box Art.dll"]